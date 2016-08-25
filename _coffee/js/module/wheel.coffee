###
增加 mousewheel 的易讀性
Depend on jquery.mousewheel
###
cf.regModule 'cfWheel', (nameSpace, fn) ->
  $self = @
  nameSpace = 'mousewheel.cfWheel.' + nameSpace

  triggerFn = (e) ->
    e.isWheelDown = e.deltaY < 0
    e.isWheelRight = e.deltaX > 0
    e.wheelDistance = e.deltaFactor
    fn and fn(e, $self)
    return

  ### 綁定 mousewheel ###
  $self.bindWheel = ->
    $self.off(nameSpace).on(nameSpace, triggerFn)
    $self

  ### 停止綁定 mousewheel ###
  $self.unbindWheel = ->
    $self.off(nameSpace)
    $self

  $self.bindWheel()
  $self