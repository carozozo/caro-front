cf.router.regPage('cf', function(cf, $page) {
  var _tracking, caro, window;
  window = cf.require('window');
  caro = cf.require('caro');
  _tracking = cf.tracking;
  _tracking.page('cf');
  $page.commonPage();
  return $page;
});
