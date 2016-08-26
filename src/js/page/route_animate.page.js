cf.router.regPage('lib/routeAnimate', function(cf, $page) {
  var window;
  window = cf.require('window');
  return $page;
});

cf.router.regBefPage(function() {
  var fn, fnArr;
  fnArr = ['left', 'right', 'scale', 'fade', 'clear'];
  fn = caro.randomPick(fnArr);
  cf.routeAnimate[fn]();
});
