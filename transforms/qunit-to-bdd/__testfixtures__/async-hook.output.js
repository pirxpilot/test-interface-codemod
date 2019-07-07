describe('server', function () {
  beforeEach(function(done) {
    login(function() {
      done();
    });
  });

  it('trips', function () {
    should.ok(true);
  });
});
