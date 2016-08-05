cf.router.regPage('view', function(cf, $page) {
  var _tracking, caro, tm, window;
  tm = cf.require('TweenMax');
  window = cf.require('window');
  caro = cf.require('caro');
  _tracking = cf.tracking;
  _tracking.page('view');
  return $page;
});
