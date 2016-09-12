###
隨目標縮放自己的大小
Depend on gsap
###
cf.regModule 'cfScale', (opt = {}) ->
  $self = @
  caro = cf.require('caro')
  tm = cf.require('TweenMax')
  ### 綁定 resize 的 name space ###
  _triggerName = 'resize.cfAutoScale'
  ### 要以哪個目標的大小為依據做縮放 ###
  $target = opt.$target or cf.$window
  ### 指定觸發縮放的 $target 寬度範圍 ###
  _startX = if caro.isNumber(opt.startX) then opt.startX else 1280
  _endX = if caro.isNumber(opt.endX) then opt.endX else 1920
  ### 指定觸發縮放的 $target 高度範圍 ###
  _startY = if caro.isNumber(opt.startY) then opt.startY else 720
  _endY = if caro.isNumber(opt.endY) then opt.endY else 1080
  ### 指定縮放範圍 ###
  _startScale = opt.startScale or 1
  _endScale = opt.endScale or 1.2
  ### 縮放基準, min: scaleX scaleY 取最小, max: scaleX scaleY 取最大, x: scaleX, y: scaleY ###
  _mode = opt.mode or 'x'
  ### 是否縮放 $self 的寬 ###
  _isScaleX = if opt.isScaleX is false then false else true
  ### 是否縮放 $self 的高 ###
  _isScaleY = opt.isScaleY
  ### scale 時間, 單位為秒 ###
  _duration = opt.duration or 0.3
  ### scale 之前的 cb, return false 會停止 scale ###
  _befScale = opt.befScale
  ### scale 之後的 cb ###
  _aftScale = opt.aftScale
  ### 設置起始的 width ###
  _basicWidth = opt.basicWidth or $self.width()
  ### 設置起始的 height ###
  _basicHeight = opt.basicHeight or $self.height()

  _selfInfo = {
    width: _basicWidth
    height: _basicHeight
    newWidth: _basicWidth
    newHeight: _basicHeight
  }
  _targetInfo = {
    width: null
    height: null
  }
  _infoObj = {
    $self: $self
    $target: $target
    selfInfo: _selfInfo
    targetInfo: _targetInfo
    scale: null
    scaleX: null
    scaleY: null
  }

  getScaleX = ->
    _targetInfo.width = width = $target.width()
    return _startScale if width < _startX
    return _endScale if width > _endX
    (width - _startX) * (_endScale - _startScale) / (_endX - _startX) + _startScale

  getScaleY = ->
    _targetInfo.height = height = $target.height()
    return _startScale if height < _startY
    return _endScale if height > _endY
    (height - _startY) * (_endScale - _startScale) / (_endY - _startY) + _startScale

  setScaleInfo = ->
    scale = null
    scaleX = getScaleX()
    scaleY = getScaleY()
    switch _mode
      when 'x'
        scale = scaleX
      when 'y'
        scale = scaleY
      when 'max'
        scale = caro.max([scaleX, scaleY])
      when 'min'
        scale = caro.min([scaleX, scaleY])
    _infoObj.scaleX = scaleX
    _infoObj.scaleY = scaleY
    _infoObj.scale = scale

  setTargetInfo = ->
    scale = setScaleInfo()
    _selfInfo.newWidth = _selfInfo.width * scale
    _selfInfo.newHeight = _selfInfo.height * scale
    return

  ### 計算並執行 scale ###
  $self.updateScale = ->
    setTargetInfo()
    return if(_befScale and _befScale(_infoObj) is false)
    scaleObj = {
      onComplete: ->
        _aftScale and _aftScale(_infoObj)
        return
    }
    scaleObj.width = _selfInfo.newWidth if _isScaleX
    scaleObj.height = _selfInfo.newHeight if _isScaleY
    tm.to($self, _duration, scaleObj)
    $self

  ### 執行 scale ###
  $self.bindScale = ->
    $target.on(_triggerName, ->
      $self.updateScale()
    )
    $self

  ### 不綁定 scale ###
  $self.unbindScale = ->
    $self.off _triggerName
    $self

  ### 設定 width 起始值 ###
  $self.setBasicWidth = (width) ->
    _selfInfo.width = width
    $self

  ### 設定 height 起始值 ###
  $self.setBasicHeight = (height) ->
    _selfInfo.height = height
    $self

  $self.bindScale()
  $self.updateScale()
  $self