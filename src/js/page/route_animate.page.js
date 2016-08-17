cf.router.regPage('lib/routeAnimate', function(cf, $page) {
  var _alert, _routeAnimate, window;
  window = cf.require('window');
  _alert = cf.alert;
  _routeAnimate = cf.routeAnimate;
  $page.dom('#setLeftBtn').onClick(function() {
    _routeAnimate.left();
    return _alert('設定換頁 left 效果');
  });
  $page.dom('#setRightBtn').onClick(function() {
    _routeAnimate.right();
    return _alert('設定換頁 right 效果');
  });
  $page.dom('#setScaleBtn').onClick(function() {
    _routeAnimate.scale();
    return _alert('設定換頁 scale 效果');
  });
  $page.dom('#setFadeBtn').onClick(function() {
    _routeAnimate.fade();
    return _alert('設定換頁 fade 效果');
  });
  $page.dom('#setClearBtn').onClick(function() {
    _routeAnimate.clear();
    return _alert('清除換場效果');
  });
  return $page;
});
