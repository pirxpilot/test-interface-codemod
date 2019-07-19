describe('router', function () {
  beforeEach(function () {
    this.router = new Router();
  });

  afterEach(function (done) {
    this.router.destroy(function() {
      done();
    });
  });

  it('should route', function () {
    should.equal(5, 5);
  });
});

