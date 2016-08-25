
/*
增加 mousewheel 的易讀性
Depend on jquery.mousewheel
 */
cf.regModule('cfWheel', function(nameSpace, fn) {
  var $self, triggerFn;
  $self = this;
  nameSpace = 'mousewheel.cfWheel.' + nameSpace;
  triggerFn = function(e) {
    e.isWheelDown = e.deltaY < 0;
    e.isWheelRight = e.deltaX > 0;
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
