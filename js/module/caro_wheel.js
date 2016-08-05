
/* depend on jquery.mousewheel */

/* 增加 mousewheel 的易讀性 */
cf.regModule('caroWheel', function(triggerName, fn) {
  var $self, ifWheelDownOrRight;
  $self = this;
  triggerName = 'mousewheel.caroWheel.' + triggerName;
  ifWheelDownOrRight = function(delta) {

    /* deltaY < 0 = 向下滾動 */

    /* deltaX < 0 = 向右滾動 */
    return delta < 0;
  };
  $self.off(triggerName).on(triggerName, function(e) {
    e.isWheelDown = ifWheelDownOrRight(e.deltaY);
    e.isWheelRight = ifWheelDownOrRight(e.deltaX);
    e.wheelDistance = e.deltaFactor;
    return fn && fn(e, $self);
  });

  /* 停止綁定 mousewheel */
  $self.unbindWheel = function() {
    $self.off(triggerName);
    return $self;
  };
  return $self;
});
