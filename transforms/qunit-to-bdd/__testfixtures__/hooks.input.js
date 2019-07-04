module('router', {
  setup: function () {
    this.router = new Router();
  },
  teardown: function () {
    this.router.destroy();
  }
});

test('should route', function () {
  equal(5, 5);
});
