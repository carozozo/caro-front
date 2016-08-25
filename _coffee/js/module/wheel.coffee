###
增加 mousewheel 的易讀性
Depend on jquery.mousewheel
###
cf.regModule 'cfWheel', (nameSpace, fn) ->
  $self = @
  nameSpace = 'mousewheel.cfWheel.' + nameSpace

  ifWheelDownOrRight = (delta) ->
    ### deltaY < 0 = 向下滾動 ###
    ### deltaX < 0 = 向右滾動 ###
    return delta < 0

  triggerFn = (e) ->
    e.isWheelDown = ifWheelDownOrRight(e.deltaY)
    e.isWheelRight = ifWheelDownOrRight(e.deltaX)
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