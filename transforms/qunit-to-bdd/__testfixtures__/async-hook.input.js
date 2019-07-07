module('server', {
  setup: function() {
    stop();
    login(function() {
      start();
    });
  }
});

test('trips', function () {
  ok(true);
});
