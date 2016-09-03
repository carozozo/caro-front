###
DOM circle 輪播效果
Depend on gsap
###
cf.regModule 'cfCircleShow', ($targetList, opt = {}) ->
  $self = @
  tm = cf.require('TweenMax')

  ### 當前 $target 的 z-index ###
  _zIndex = opt.zIndex or 999
  ### 旋轉半徑 ###
  _radios = opt.radios or 100
  ### 移動時間 ###
  _duration = opt.duration or 1
  ### 最後面的 $target 的亮度百分比 ###
  _minBrightness = opt.minBrightness or 50
  ### 每個 target 的 top 位移量 ###
  _degreeTop = opt.degreeTop or 0
  ### 最後面的 $target 的 scale ###
  _minScale = opt.minScale or 1
  ### TweenMax ease 效果 ###
  _ease = opt.ease
  ### 每次移動的 cb, 可取得目前最前面的 $dom 和 index ###
  _cb = opt.cb

  _targetLength = $targetList.length
  ### 角度級距 ###
  _angleDif = 360 / _targetLength
  ### 亮度級距 ###
  _brightnessDif = (100 - _minBrightness) / (_targetLength / 2)
  ### scale 級距 ###
  _scaleDif = (1 - _minScale) / (_targetLength / 2)
  _currentIndex = 0
  _interval = null

  ### 用來存儲計算過的數值 ###
  _radianMap = {}
  _topMap = {}
  _leftMap = {}
  _zIndexMap = {}
  _brightnessMap = {}
  _scaleMap = {}

  getRadians = (i) ->
    return _radianMap[i] if _radianMap[i]
    ### 角度轉換成弧度, 起始點為 90 度 ###
    degrees = _angleDif * i + 90
    _radianMap[i] = degrees * Math.PI / 180

  getTop = (i) ->
    return _topMap[i] if _topMap[i]
    _topMap[i] = _degreeTop * Math.abs(_targetLength / 2 - i)

  getLeft = (i) ->
    return _leftMap[i] if _leftMap[i]
    radians = getRadians(i)
    ### 位移量 ###
    x = Math.cos(radians)
    _leftMap[i] = _radios * (1 + x)

  getZindex = (i) ->
    return _zIndexMap[i] if _zIndexMap[i]
    zIndex = _zIndex - (cf.min([i, _targetLength - i]) * 2)
    zIndex++ if i < _targetLength / 2
    _zIndexMap[i] = zIndex

  getBrightness = (i) ->
    return _brightnessMap[i] if _brightnessMap[i]
    _brightnessMap[i] = 100 - (_brightnessDif * cf.min([i, _targetLength - i]))

  getScale = (i) ->
    return _scaleMap[i] if _scaleMap[i]
    _scaleMap[i] = 1 - (_scaleDif * cf.min([i, _targetLength - i]))

  movePosition = (isSet) ->
    cf.forEach($targetList, ($target, i) ->
      opt = {
        y: getTop(i)
        x: getLeft(i)
        '-webkit-filter': 'brightness(' + getBrightness(i) + '%)'
        'filter': 'brightness(' + getBrightness(i) + '%)'
        scale: getScale(i)
        ease: _ease
      }
      if isSet
        tm.set($target, opt)
      else
        tm.to($target, _duration, opt)
      tm.to($target, _duration / 4, {
        'z-index': getZindex(i)
      })
      _cb and _cb($target, i) if i is _currentIndex
      return
    )

  cf.forEach($targetList, ($target, i) ->
    $target.css(
      position: 'absolute'
      y: getTop(i)
      x: getLeft(i)
      'z-index': getZindex(i)
      '-webkit-filter': 'brightness(' + getBrightness(i) + '%)'
      'filter': 'brightness(' + getBrightness(i) + '%)'
    )
    return
  )

  ### 顯示下一個內容 ###
  $self.next = ->
    _currentIndex = 0 if ++_currentIndex is _targetLength
    $first = $targetList.shift()
    $targetList.push($first)
    movePosition()
    $self

  ### 顯示上一個內容 ###
  $self.prev = ->
    _currentIndex = _targetLength - 1 if --_currentIndex is -1
    $last = $targetList.pop()
    $targetList.unshift($last)
    movePosition()
    $self

  ### 取得目前內容的 index ###
  $self.getCurrentIndex = ->
    _currentIndex

  ### 自動輪播 ###
  $self.autoPlay = (ms = 1000, isNext = true) ->
    fn = if isNext then $self.next else $self.prev
    fn()
    _interval = setInterval(fn, ms)
    $self

  ### 停止輪播 ###
  $self.stopPlay = ->
    clearInterval(_interval)
    $self

  movePosition(true)

  $self