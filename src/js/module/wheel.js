
/*
增加 mousewheel 的易讀性
Depend on jquery.mousewheel
 */
cf.regModule('cfWheel', function(fn) {
  var $self, triggerFn, triggerName;
  $self = this;
  triggerName = 'mousewheel.cfWheel';
  triggerFn = function(e) {
    e.isWheelDown = e.deltaY < 0;
    e.isWheelRight = e.deltaX > 0;
    e.wheelDistance = e.deltaFactor;
    fn && fn(e, $self);
  };

  /* 綁定 mousewheel */
  $self.bindWheel = function() {
    return $self.on(triggerName, triggerFn);
  };

  /* 停止綁定 mousewheel */
  $self.unbindWheel = function() {
    return $self.off(triggerName);
  };
  $self.bindWheel();
  return $self;
});
