
/*
增加 mousewheel 的易讀性
Depend on jquery.mousewheel
 */
cf.regModule('cfWheel', function(nameSpace, fn) {
  var $self, ifWheelDownOrRight, triggerFn;
  $self = this;
  nameSpace = 'mousewheel.cfWheel.' + nameSpace;
  ifWheelDownOrRight = function(delta) {

    /* deltaY < 0 = 向下滾動 */

    /* deltaX < 0 = 向右滾動 */
    return delta < 0;
  };
  triggerFn = function(e) {
    e.isWheelDown = ifWheelDownOrRight(e.deltaY);
    e.isWheelRight = ifWheelDownOrRight(e.deltaX);
    e.wheelDistance = e.deltaFactor;
    fn && fn(e, $self);
  };

  /* 綁定 mousewheel */
  $self.bindWheel = function() {
    $self.off(nameSpace).on(nameSpace, triggerFn);
    return $self;
  };

  /* 停止綁定 mousewheel */
  $self.unbindWheel = function() {
    $self.off(nameSpace);
    return $self;
  };
  $self.bindWheel();
  return $self;
});
