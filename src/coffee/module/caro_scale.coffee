### 隨目標縮放自己的大小 ###
cf.regModule 'caroScale', (opt = {}) ->
  $self = this
  cf = $self.cf
  caro = cf.require('caro')
  tm = cf.require('TweenMax')

  $target = opt.$target or cf.$window
  ### 綁定 resize 的 name space ###
  _triggerName = if opt.triggerName then 'resize.caroAutoScale.' + opt.triggerName else 'resize.caroAutoScale'
  ### 指定觸發縮放的 $target 寬度範圍 ###
  oStartX = if caro.isNumber(opt.startX) then opt.startX else 1100
  oEndX = if caro.isNumber(opt.endX) then opt.endX else 1920
  ### 指定觸發縮放的 $target 高度範圍 ###
  oStartY = if caro.isNumber(opt.startY) then opt.startY else 600
  oEndY = if caro.isNumber(opt.endY) then opt.endY else 1080
  ### 指定縮放範圍 ###
  oStartScale = opt.startScale or 1
  oEndScale = opt.endScale or 1.2
  ### 縮放基準, min: scaleX scaleY 取最小, max: scaleX scaleY 取最大, x: scaleX, y: scaleY ###
  oMode = opt.mode or 'x'
  ### 是否縮放 $self 的寬 ###
  oIsScaleX = if opt.isScaleX is false then false else true
  ### 是否縮放 $self 的高 ###
  oIsScaleY = opt.isScaleY
  ### scale 時間, 單位為秒 ###
  oDuration = opt.duration or 0.3
  ### scale 之前的 cb, 回傳 false 會停止 scale ###
  oBefScale = opt.befScale
  ### 用來取得 scale 之後的 css 資訊 ###
  oAftScale = opt.aftScale


  selfWidth = $self.width()
  selfHeight = $self.height()
  _selfInfo = {
    width: selfWidth
    height: selfHeight
    newWidth: selfWidth
    newHeight: selfHeight
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
    return oStartScale if width < oStartX
    return oEndScale if width > oEndX
    (width - oStartX) * (oEndScale - oStartScale) / (oEndX - oStartX) + oStartScale

  getScaleY = ->
    _targetInfo.height = height = $target.height()
    return oStartScale if height < oStartY
    return oEndScale if height > oEndY
    (height - oStartY) * (oEndScale - oStartScale) / (oEndY - oStartY) + oStartScale

  setScaleInfo = ->
    scale = null
    scaleX = getScaleX()
    scaleY = getScaleY()
    switch oMode
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

  $self.updateScale = ->
    setTargetInfo()
    return if(oBefScale and oBefScale(_infoObj) is false)
    scaleObj = {
      onComplete: ->
        oAftScale and oAftScale(_infoObj)
        return
    }
    scaleObj.width = _selfInfo.newWidth if oIsScaleX
    scaleObj.height = _selfInfo.newHeight if oIsScaleY
    tm.to($self, oDuration, scaleObj)
    $self

  $self.bindScale = ->
    $target.off(_triggerName).on(_triggerName, ->
      $self.updateScale()
    )
    $self

  $self.unbindScale = ->
    $self.off _triggerName
    $self

  $self.bindScale()
  $self.updateScale()
  $self