describe('router', function () {
  it('navigates to new page (async)', function(done) {
    router.navigate(function (newPage) {
      should.equal( newPage.id, 1 );
      done();
    });
  });
});
