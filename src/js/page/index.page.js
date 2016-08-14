cf.router.regPage('index', function(cf, $page) {
  var $, _tracking, caro, window;
  window = cf.require('window');
  caro = cf.require('caro');
  $ = cf.require('$');
  _tracking = cf.tracking;
  _tracking.page('index');
  return $page;
});

cf.regDocReady(function() {
  $('#headerTitle').dom().onClick(function() {
    cf.router.goPage('index');
  });
});
