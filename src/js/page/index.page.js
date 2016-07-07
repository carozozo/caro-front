cf.router.regPage('index', function(cf, $page) {
  var _tracking, caro, tl, tm, window;
  tm = cf.require('TweenMax');
  tl = cf.require('TimelineMax');
  window = cf.require('window');
  caro = cf.require('caro');
  _tracking = cf.tracking;
  _tracking.page('index');
  return $page;
});
