cf.router.regPage('lib/routeAnimate', function(cf) {
  var $page, window;
  $page = this;
  window = cf.require('window');
  return $page;
});

cf.router.regBefPage(function() {
  var fn, fnArr;
  fnArr = [];
  cf.forEach(cf.routeAnimate, function(fn, fnName) {
    return fnArr.push(fnName);
  });
  fn = cf.randomPick(fnArr);
  cf.routeAnimate[fn]();
});