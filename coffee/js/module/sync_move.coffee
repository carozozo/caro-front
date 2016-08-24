###
計算滑鼠和基準點的距離，同步移動 DOM
###
cf.regModule 'cfSyncMove', (nameSpace, opt = {}) ->
  ### nameSpace: 滑鼠移動的 name space 防止重複觸發 ###
  $self = @
  cf = $self.cf
  $window = cf.$window
  $document = cf.$document
  caro = cf.require('caro')
  tm = cf.require('TweenMax')

  ### X軸基準坐標 ###
  _baseX = if opt.baseX isnt undefined then opt.baseX else ->
    $window.width() / 2
  ### Y軸基準坐標 ###
  _baseY = opt.baseY
  ### X移動比例 ###
  _proportionX = opt.proportionX or 1
  ### Y移動比例 ###
  _proportionY = opt.proportionY or 1
  ### X最大移動範圍 ###
  _rangeX = opt.rangeX or 10
  ### Y最大移動範圍 ###
  _rangeY = opt.rangeY or 10
  ### x 是否和滑鼠方向一樣 ###
  _reverseX = if opt.reverseX is false then opt.reverseX else true
  ### y 是否和滑鼠方向一樣 ###
  _reverseY = if opt.reverseY is false then opt.reverseY else true
  ### 移動之前的 cb, 如果 return false 則不移動 ###
  _befMove = opt.befMove
  ### 移動之後的 cb ###
  _aftMove = opt.aftMove
  ### 停止移動之後的 cb ###
  _stopMove = opt.stopMove

  _triggerName1 = 'mousemove.cfSyncMove'
  _triggerName2 = 'touchmove.cfSyncMove'

  if nameSpace
    _triggerName1 += '.' + nameSpace
    _triggerName2 += '.' + nameSpace

  triggerFn = (e) ->
    targetTouches = e.originalEvent and e.originalEvent.targetTouches or [{}]
    mouseX = e.pageX or targetTouches.pageX
    mouseY = e.pageY or targetTouches.pageY
    infoObj = {
      e: e
      moveX: 0
      moveY: 0
      mouseX: mouseX
      mouseY: mouseY
      baseX: null
      baseY: null
      $self: $self
    }
    moveObj = {
      x: null
      y: null
      onComplete: ->
        _aftMove and _aftMove(infoObj)

    }
    baseX = if caro.isFunction(_baseX) then _baseX() else _baseX
    if caro.isNumber(baseX)
      moveX = mouseX - baseX
      targetMoveX = moveX * _proportionX
      if targetMoveX > _rangeX
        targetMoveX = _rangeX
      else if targetMoveX < -_rangeX
        targetMoveX = -_rangeX
      targetMoveX = -targetMoveX if _reverseX
      infoObj.moveX = moveObj.x = targetMoveX or 0
      infoObj.baseX = baseX

    baseY = if caro.isFunction(_baseY) then _baseY() else _baseY
    if caro.isNumber(baseY)
      moveY = mouseY - baseY
      targetMoveY = moveY * _proportionY
      if targetMoveY > _rangeY
        targetMoveY = _rangeY
      else if targetMoveY < -_rangeY
        targetMoveY = -_rangeY
      targetMoveY = -targetMoveY if _reverseY
      infoObj.moveY = moveObj.y = targetMoveY or 0
      infoObj.baseY = baseY

    return if _befMove and _befMove(infoObj) is false
    tm.to($self, 1, moveObj)
    clearTimeout($self.data("syncMoveCheck." + nameSpace));
    $self.data("syncMoveCheck." + nameSpace, setTimeout(->
      _stopMove and _stopMove()
    , 250))
    return


  $document.on(_triggerName1, triggerFn)
  $document.on(_triggerName2, triggerFn)

  ### 停止監聽 mousemove ###
  $self.stopSyncMove = ->
    $document.off(_triggerName1)
    $document.off(_triggerName2)

  $self