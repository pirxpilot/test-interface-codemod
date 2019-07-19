module('router');

test('navigates to new page (async)', function () {
  stop();
  router.navigate(function (newPage) {
    equal( newPage.id, 1 );
    start();
  });
});
