### depend on jquery.mousewheel ###
### 增加 mousewheel 的易讀性 ###
cf.regModule 'caroWheel', (triggerName, fn) ->
  $self = this
  triggerName = 'mousewheel.caroWheel.' + triggerName

  ifWheelDownOrRight = (delta) ->
    ### deltaY < 0 = 向下滾動 ###
    ### deltaX < 0 = 向右滾動 ###
    return delta < 0

  $self.off(triggerName).on(triggerName, (e) ->
    e.isWheelDown = ifWheelDownOrRight(e.deltaY)
    e.isWheelRight = ifWheelDownOrRight(e.deltaX)
    e.wheelDistance = e.deltaFactor
    fn and fn(e, $self)
  )

  $self.unbindWheel = ->
    $self.off(triggerName)
    $self

  $self