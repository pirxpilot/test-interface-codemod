const { getParser } = require('codemod-cli').jscodeshift;
const { getOptions } = require('codemod-cli');

module.exports = function transformer(file, api) {
  const j = getParser(api);

  const root = j(file.source);

  // Check if 'mocha' is already required
  const hasMochaRequire =
    root
      .find(j.VariableDeclaration, {
        declarations: [
          {
            init: {
              callee: { name: 'require' },
              arguments: [{ value: 'mocha' }]
            }
          }
        ]
      })
      .size() > 0;

  if (!hasMochaRequire) {
    // List of well-known Mocha functions
    const mochaFunctions = [
      'describe',
      'it',
      'before',
      'after',
      'beforeEach',
      'afterEach'
    ];

    // Find all used Mocha functions in the file
    const usedMochaFunctions = new Set();
    root.find(j.CallExpression, node => {
      if (mochaFunctions.includes(node.callee.name)) {
        usedMochaFunctions.add(node.callee.name);
        return true;
      }
      return false;
    });

    if (usedMochaFunctions.size > 0) {
      root
        .find(j.Program)
        .get('body', 0)
        .insertBefore(
          j.variableDeclaration('const', [
            j.variableDeclarator(
              j.objectPattern(
                Array.from(usedMochaFunctions)
                  .sort()
                  .map(func => {
                    const prop = j.property(
                      'init',
                      j.identifier(func),
                      j.identifier(func)
                    );
                    prop.shorthand = true; // Use shorthand syntax
                    return prop;
                  })
              ),
              j.callExpression(j.identifier('require'), [j.literal('mocha')])
            )
          ])
        );
    }
  }

  return root.toSource();
};
