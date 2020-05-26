const { getParser } = require('codemod-cli').jscodeshift;

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const root = j(file.source);

  let expected;

  root
    .find(j.Identifier, { name: 'expected' })
    .some(path => {
      expected = path.parentPath.value.init;
      return true;
    });

  if (!expected) {
    return;
  }

  let name;
  let ext;


  root
    .find(j.Literal)
    .some(path => extractNameExt(path.value.value));

  if (!name) {
    root
      .find(j.TemplateElement)
      .some(path => extractNameExt(path.value.value.raw));
  }

  if (!name || !ext) {
    return;
  }

  return root.find(j.Program).replaceWith(toProgram()).toSource({
    quote: 'single'
  });

  function extractNameExt(str) {
    const match = str.match(/example\/(\S+)\.(\S+)/);
    if (match) {
      name = match[1];
      ext = match[2];
      return true;
    }
  }

  function toProgram() {
    return j.program([
      toRequire(),
      toLifts()
    ]);
  }

  function toRequire() {
    return j.variableDeclaration('const',
      [ j.variableDeclarator(
          j.identifier('lifts'),
          j.callExpression(
            j.identifier('require'),
            [ j.literal('../lifts') ]
          )
        )
      ]
    );
  }

  function toLifts() {
    const args = [
      j.literal(name),
      j.literal(ext),
      expected
    ];
    return j.expressionStatement(
      j.callExpression(
        j.identifier('lifts'),
        args
      )
    );
  }

};
