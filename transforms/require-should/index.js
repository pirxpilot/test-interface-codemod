const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');

module.exports = function transformer(file, api) {
  const j = getParser(api);
  const root = j(file.source);

  let shouldImported = false;

  root.find(j.VariableDeclarator, { id: { name: 'should' } }).forEach(() => {
    shouldImported = true;
  });

  // find all should usages - ignore `should` in object properties
  const shouldUsages = root
    .find(j.Identifier, { name: 'should' })
    .filter(path => {
      return !(
        j.MemberExpression.check(path.parentPath.node) &&
        path.parentPath.node.property === path.node
      );
    });

  if (shouldUsages.size() > 0 && !shouldImported) {
    root.find(j.Program).forEach(path => {
      path.node.body.unshift(
        j.variableDeclaration('const', [
          j.variableDeclarator(
            j.identifier('should'),
            j.callExpression(j.identifier('require'), [j.literal('should')])
          )
        ])
      );
    });
  }

  return root.toSource();
};
