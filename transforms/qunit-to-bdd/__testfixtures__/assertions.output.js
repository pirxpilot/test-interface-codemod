describe('assertions', function () {
  it('all', function () {
    should.ok(true, 'ok');
    should.fail(false, 'this should be OK as well');
    should.ifError(false, 'ok');

    should.equal(5, 5);
    should.notEqual(3, 7);

    should.strictEqual(1, 1);
    should.notStrictEqual(2, 2);

    should.deepEqual({ a: 1 }, { a: 2 });
    should.notDeepEqual({ a: 1 }, { a: 2 });

    checkOutside();
  });
});

function checkOutside() {
  should.equal(5, 5);
}
