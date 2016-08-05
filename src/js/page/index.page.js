cf.router.regPage('index', function(cf, $page) {
  var _tracking, caro, window;
  window = cf.require('window');
  caro = cf.require('caro');
  _tracking = cf.tracking;
  _tracking.page('index');
  return $page;
});

cf.router.regAftPage(function() {
  cf.router.$page.commonPage();
});
