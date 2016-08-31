###
計算滑鼠和基準點的距離，同步移動 DOM
Depend on gsap
###
cf.regModule 'cfSyncMove', (opt = {}) ->
  $self = @
  cf = $self.cf
  $window = cf.$window
  $document = cf.$document
  caro = cf.require('caro')
  tm = cf.require('TweenMax')

  ### x 軸基準坐標, 設為 false 則不同步移動 x ###
  _baseX = if opt.baseX isnt undefined then opt.baseX else -> $window.width() / 2
  ### y 軸基準坐標, 設為 false 則不同步移動 y ###
  _baseY = if opt.baseY isnt undefined then opt.baseY else -> $window.height() / 2
  ### x 移動比例 ###
  _proportionX = opt.proportionX or .05
  ### y 移動比例 ###
  _proportionY = opt.proportionY or .05
  ### x 最大移動範圍, 未設置代表不限制 ###
  _rangeX = opt.rangeX
  ### y 最大移動範圍, 未設置代表不限制 ###
  _rangeY = opt.rangeY
  ### x 是否和滑鼠方向一樣 ###
  _reverseX = if opt.reverseX is false then false else true
  ### y 是否和滑鼠方向一樣 ###
  _reverseY = if opt.reverseY is false then false else true
  ### 移動之前的 cb, 如果 return false 則不移動 ###
  _befMove = opt.befMove
  ### 移動之後的 cb ###
  _aftMove = opt.aftMove
  ### 停止移動之後的 cb ###
  _stopMove = opt.stopMove

  _triggerName1 = 'mousemove.cfSyncMove'
  _triggerName2 = 'touchmove.cfSyncMove'

  triggerFn = (e) ->
    targetTouches = e.originalEvent and e.originalEvent.targetTouches or [{}]
    mouseX = e.pageX or targetTouches.pageX
    mouseY = e.pageY or targetTouches.pageY
    infoObj = {
      event: e
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
        return
    }
    baseX = if caro.isFunction(_baseX) then _baseX() else _baseX
    if caro.isNumber(baseX)
      moveX = mouseX - baseX
      targetMoveX = moveX * _proportionX
      if _rangeX
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
      if _rangeY
        if targetMoveY > _rangeY
          targetMoveY = _rangeY
        else if targetMoveY < -_rangeY
          targetMoveY = -_rangeY
      targetMoveY = -targetMoveY if _reverseY
      infoObj.moveY = moveObj.y = targetMoveY or 0
      infoObj.baseY = baseY

    return if _befMove and _befMove(infoObj) is false
    tm.to($self, 1, moveObj)
    clearTimeout($self.data("syncMoveCheck"));
    $self.data("syncMoveCheck", setTimeout(->
      _stopMove and _stopMove()
      return
    , 250))
    return

  ### 開始監聽滑鼠並同步移動 ###
  $self.startSyncMove = ->
    $document.on(_triggerName1, triggerFn)
    $document.on(_triggerName2, triggerFn)
    $self

  ### 停止監聽滑鼠 ###
  $self.stopSyncMove = ->
    $document.off(_triggerName1)
    $document.off(_triggerName2)
    $self

  $self