cf.router.regPage('module/cfWheel', function(cf) {
  var $page, $wheelInfo, bgColorArr;
  $page = this;
  bgColorArr = cf.data('bgColorArr');
  $wheelInfo = $page.dom('#wheelInfo');
  $page.cfWheel('cfWheel', function(e) {
    var info;
    info = {
      isWheelDown: e.isWheelDown,
      isWheelRight: e.isWheelRight,
      wheelDistance: e.wheelDistance,
      deltaY: e.deltaY,
      deltaX: e.deltaX
    };
    info = JSON.stringify(info);
    return $wheelInfo.html(info);
  });
  return $page;
});
