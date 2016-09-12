cf.router.regPage('lib/routeAnimate', function(cf) {
  var $page, window;
  $page = this;
  window = cf.require('window');
  return $page;
});

cf.router.regBefPage(function() {
  var caro, fn, fnArr;
  fnArr = [];
  caro = cf.require('caro');
  caro.forEach(cf.routeAnimate, function(fn, fnName) {
    return fnArr.push(fnName);
  });
  fn = caro.randomPick(fnArr);
  cf.routeAnimate[fn]();
});
