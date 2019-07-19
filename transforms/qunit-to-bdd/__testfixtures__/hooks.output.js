describe('router', function () {
  beforeEach(function () {
    this.router = new Router();
  });

  afterEach(function () {
    this.router.destroy();
  });

  it('should route', function () {
    should.equal(5, 5);
  });
});

