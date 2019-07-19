module('router', {
  setup() {
    this.router = new Router();
  },
  teardown() {
    stop();
    this.router.destroy(function() {
      start();
    });
  }
});

test('should route', function () {
  equal(5, 5);
});
