
/*
增加 mousewheel 的易讀性
Depend on jquery.mousewheel
 */
cf.regModule('cfWheel', function(nameSpace, fn) {
  var $self, ifWheelDownOrRight;
  $self = this;
  nameSpace = 'mousewheel.cfWheel.' + nameSpace;
  ifWheelDownOrRight = function(delta) {

    /* deltaY < 0 = 向下滾動 */

    /* deltaX < 0 = 向右滾動 */
    return delta < 0;
  };
  $self.off(nameSpace).on(nameSpace, function(e) {
    e.isWheelDown = ifWheelDownOrRight(e.deltaY);
    e.isWheelRight = ifWheelDownOrRight(e.deltaX);
    e.wheelDistance = e.deltaFactor;
    return fn && fn(e, $self);
  });

  /* 停止綁定 mousewheel */
  $self.unbindWheel = function() {
    $self.off(nameSpace);
    return $self;
  };
  return $self;
});
