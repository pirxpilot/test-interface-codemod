const { getParser } = require('codemod-cli').jscodeshift;

const ASSERT_MAP = {
  deepEqual: 'should.deepEqual',
  equal: 'should.equal',
  fail: 'should.fail',
  notOk: 'should.ifError',
  notDeepEqual: 'should.notDeepEqual',
  notEqual: 'should.notEqual',
  notStrictEqual: 'should.notStrictEqual',
  ok: 'should.ok',
  strictEqual: 'should.strictEqual',
  throws: 'should.throws'
};

const HOOKS_MAP = {
  setup: 'beforeEach',
  teardown: 'afterEach'
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

  fixAssertions(result);

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

    const expressions = [...getHooks(args[1]), ...pathTests.map(toIt)];
    const describeArgs = [
      args[0],
      j.functionExpression(j.identifier(''), [], j.blockStatement(expressions))
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

    // get function expression
    const fe = p.get('expression', 'arguments', 1);
    fixAsync(fe.node);

    return p.node;
  }

  function fixAssertions(p) {
    p.find(j.CallExpression).forEach(path => {
      path.node.callee.name = fixName(path.node.callee.name);
    });

    function fixName(name) {
      return ASSERT_MAP[name] || name;
    }
  }

  function fixAsync(fe) {
    let isAsync = false;

    // remove all stop() calls
    j(fe).find(j.ExpressionStatement, {
      expression: {
        callee: { name: 'stop' }
      }
    }).forEach(p => {
      j(p).remove();
      isAsync = true;
    });

    if (!isAsync) {
      return;
    }

    // replace start() calls with done()
    j(fe)
      .find(j.Identifier, { name: 'start' })
      .forEach(p => j(p).replaceWith(j.identifier('done')));

    // pass done as a parameter
    fe.params.push(j.identifier('done'));
  }

  function getHooks({ properties = [] } = {}) {
    return properties.map(makeHook).filter(Boolean);

    function makeHook({ key, value, body }) {
      const name = HOOKS_MAP[key.value || key.name];
      if (!name) {
        return;
      }
      if (!value) {
        // property was an object method
        value = j.functionExpression(j.identifier(''), [], body);
      }
      fixAsync(value);
      return j.expressionStatement(
        j.callExpression(
          j.identifier(name),
          [ value ]
        )
      );
    }
  }

  function getFirstNode(root) {
    return root.find(j.Program).get('body', 0).node;
  }
};
