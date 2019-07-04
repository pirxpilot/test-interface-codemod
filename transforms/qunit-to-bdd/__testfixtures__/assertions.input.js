module('assertions');

test('all', function () {
  ok(true, 'ok');
  fail(false, 'this should be OK as well');
  notOk(false, 'ok');

  equal(5, 5);
  notEqual(3, 7);

  strictEqual(1, 1);
  notStrictEqual(2, 2);

  deepEqual({ a: 1 }, { a: 2 });
  notDeepEqual({ a: 1 }, { a: 2 });

  checkOutside();
});

function checkOutside() {
  equal(5, 5);
}
