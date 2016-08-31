###
增加 mousewheel 的易讀性
Depend on jquery.mousewheel
###
cf.regModule 'cfWheel', (fn) ->
  $self = @
  triggerName = 'mousewheel.cfWheel'

  triggerFn = (e) ->
    e.isWheelDown = e.deltaY < 0
    e.isWheelRight = e.deltaX > 0
    e.wheelDistance = e.deltaFactor
    fn and fn(e, $self)
    return

  ### 綁定 mousewheel ###
  $self.bindWheel = ->
    $self.on(triggerName, triggerFn)

  ### 停止綁定 mousewheel ###
  $self.unbindWheel = ->
    $self.off(triggerName)

  $self.bindWheel()
  $self