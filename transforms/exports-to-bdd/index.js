const { basename } = require('path');

module.exports = transform;


const SPECIAL = [
  'after',
  'afterEach',
  'before',
  'beforeEach'
];

function transform (file, api) {
  const j = api.jscodeshift;

  const parsed = j(file.source)
    .find(j.ExpressionStatement, {
      expression: {
        operator: '=',
        left:  {
          object: { name: 'module' },
          property: { name: 'exports' }
        }
      }
    })
    .forEach(path => {
      // console.log(path.node.expression.right.properties);
      // properties.map(toTest).forEach(node => j(node).insertAfter(path));
      j(path).replaceWith(toDescribe);
    });



  const transformed = parsed;

  const outputOptions = {
    quote: 'single'
  };
  return transformed.toSource(outputOptions);


  function toDescribe(path) {
    const { properties } = path.value.expression.right;

    const args = [
      j.literal(basename(file.path, '.test.js')),
      j.functionExpression(j.identifier(''), [], j.blockStatement(properties.map(toFunction)))
    ];
    return j.expressionStatement(
      j.callExpression(
        j.identifier('describe'),
        args
      )
    );
  }

  function toFunction({ key, value }) {
    const name = key.name || key.value;
    return SPECIAL.includes(name) ? toSpecial(name, value) : toIt(name, value);
  }

  function toIt(name, value) {
    return j.expressionStatement(
      j.callExpression(
        j.identifier('it'),
        [ j.literal(name), value ]
      )
    );
  }

  function toSpecial(name, value) {
    return j.expressionStatement(
      j.callExpression(
        j.identifier(name),
        [ value ]
      )
    );
  }
}
