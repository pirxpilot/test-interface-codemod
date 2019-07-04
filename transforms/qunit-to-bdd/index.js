const { getParser } = require('codemod-cli').jscodeshift;

const ASSERT_MAP = {
  'equal': 'should.equal'
};

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const root = j(file.source);

  // Save the comments attached to the first node
  const firstNodeBefore = getFirstNode(root);

  let pathModule;
  let pathTests = [];

  const result = root
    .find(j.ExpressionStatement, {
      expression: {
        type: 'CallExpression'
      }
    })
    .forEach(path => {
      const { name } = path.node.expression.callee;
      if (name === 'module') {
        emitDescribe(path);
      } else if (name === 'test') {
        pathTests.push(path);
      }
    });

  emitDescribe();

  const firstNodeAfter = getFirstNode(root);
  if (firstNodeAfter !== firstNodeBefore) {
    firstNodeAfter.comments = firstNodeBefore.comments;
  }

  return result.toSource();


  function emitDescribe(path) {
    if (pathModule) {
      j(pathModule).replaceWith(toDescribe());
      pathTests.forEach(path => j(path).remove());
    }
    pathModule = path;
    pathTests = [];
  }

  function toDescribe() {
    const { 'arguments': args } = pathModule.node.expression;

    const describeArgs = [
      args[0],
      j.functionExpression(j.identifier(''), [], j.blockStatement(pathTests.map(toIt)))
    ];
    return j.expressionStatement(
      j.callExpression(
        j.identifier('describe'),
        describeArgs
      )
    );
  }

  function toIt(p) {
    p.node.expression.callee.name = 'it';

    j(p).find(j.CallExpression).forEach(path => {
      path.node.callee.name = fixAssertions(path.node.callee.name);
    });

    return p.node;
  }

  function fixAssertions(name) {
    return ASSERT_MAP[name] || name;
  }


  function getFirstNode(root) {
    return root.find(j.Program).get('body', 0).node;
  }
};
