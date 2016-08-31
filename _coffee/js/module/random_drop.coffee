###
隨機產生滑落物件, 例如水滴, 氣泡效果
Depend on gsap
###
cf.regModule 'cfRandomDrop', ($imgArr, opt = {}) ->
  $self = @
  cf = $self.cf
  $ = cf.require('$')
  caro = cf.require('caro')
  tm = cf.require('TweenMax')
  tl = cf.require('TimelineMax')
  Power2 = cf.require('Power2')
  $window = cf.$window
  _isKeepDrop = true

  ### 產生物件的 x 軸範圍 ###
  minStartX = opt.minStartX or 0
  maxStartX = opt.maxStartX or -> $self.width()
  ### 產生物件的 y 軸範圍 ###
  minStartY = opt.minStartY or 0
  maxStartY = opt.maxStartY or -> $self.height()
  ### 間隔最短多少毫秒產生新滑落物件 ###
  minRandomMs = opt.minRandomMs or 0
  ### 間隔最長多少毫秒產生新物件 ###
  maxRandomMs = opt.maxRandomMs or minRandomMs + 1000
  ### 滑落物件產生時, 要停留在原地的秒數 ###
  inStartDuration = opt.inStartDuration or 0
  ### 滑落物件移動完成時, 要停留在原地的秒數 ###
  inEndDuration = opt.inEndDuration or 0
  ### 最小移動秒數 ###
  minDuration = opt.minDuration or 3
  ### 最大移動秒數 ###
  maxDuration = opt.maxDuration or 5
  ### 最小移動距離 ###
  minDistance = opt.minDistance or 0
  ### 最大移動距離 ###
  maxDistance = opt.maxDistance or -> $self.height()
  ### 每次隨機產生的滑落物件最小縮放值 ###
  minScale = opt.minScale or 1
  ### 移動時的旋轉角度範圍 ###
  rotationRange = opt.rotationRange or 0
  ### 橫向移動範圍 ###
  xRange = opt.xRange or 0
  ### 反轉方向 ###
  reverse = opt.reverse
  ### 每次產生的滑落物件數量 ###
  amount = opt.amount or 1

  imgLength = $imgArr.length
  caro.forEach($imgArr, ($img) ->
    $img.css(
      position: 'absolute'
    )
    return
  )

  pickupImg = ->
    random = Math.floor(Math.random() * imgLength)
    $img = $imgArr[random].clone(true)
    scale = Math.random() * (1 - minScale) + minScale
    tm.set($img, scale: scale)
    $img

  getLengthIfFn = (distance)->
    if caro.isFunction(distance) then distance() else distance

  getRandomInRange = (start, end) ->
    Math.random() * (end - start) + start

  randomMs = ->
    getRandomInRange(minRandomMs, maxRandomMs)

  randomInStartDuration = ->
    Math.random() * inStartDuration

  randomInEndDuration = ->
    Math.random() * inEndDuration

  randomDuration = ->
    getRandomInRange(minDuration, maxDuration)

  randomLeft = (imgWidth) ->
    maxStart = getLengthIfFn(maxStartX)
    minStart = getLengthIfFn(minStartX)
    imgMaxX = maxStart - imgWidth
    getRandomInRange(minStart, imgMaxX)

  randomTop = (imgHeight) ->
    maxStart = getLengthIfFn(maxStartY)
    minStart = getLengthIfFn(minStartY)
    imgMaxY = maxStart - imgHeight
    getRandomInRange(minStart, imgMaxY)

  randomNewTop = (imgHeight, top) ->
    maxDis = getLengthIfFn(maxDistance)
    distance = getRandomInRange(minDistance, maxDis)
    unless reverse
      imgMaxY = $self.height() - imgHeight
      newTop = top + distance
      newTop = imgMaxY if(newTop > imgMaxY)
    else
      newTop = top - distance
      newTop = 0 if(newTop < 0)
    newTop

  randomBezierArray = ->
    x = Math.random() * xRange
    if(Math.random() > 0.5)
      return [{x: x}, {x: -x}, {x: 0}]
    return [{x: -x}, {x: x}, {x: 0}]

  createDrop = (opt = {}) ->
    $img = pickupImg()
    imgWidth = $img.width()
    imgHeight = $img.height()
    left = opt.left or randomLeft(imgWidth)
    top = opt.top or randomTop(imgHeight)
    isKeepDrop = if caro.isBoolean(opt.isKeepDrop) then opt.isKeepDrop else _isKeepDrop
    newTop = randomNewTop(imgHeight, top)
    duration = randomDuration()
    distance = Math.abs(top - newTop)
    tm.set($img,
      opacity: 0
      top: top
      left: left
    )
    $self.append $img

    tl1 = new tl()
    objForMove = {
      top: newTop
      ease: Power2.easeIn
    }
    objForMove.bezier = randomBezierArray() if xRange and distance > 50
    tl1.to($img, 0.2, {opacity: 1})
    .to($img, duration, objForMove, '+=' + randomInStartDuration())
    .to($img, 0.2,
      opacity: 0
      onComplete: ->
        $img.remove()
        return
    , '+=' + randomInEndDuration())
    if rotationRange
      tl2 = new tl()
      rotation = caro.randomInt(rotationRange, -rotationRange)
      tl2.to($img, duration, {
        rotation: rotation
      }, '+=0.3')
    return unless isKeepDrop
    setTimeout(->
      createDrop()
    , randomMs())

  ### 開始產生滑落物件 ###
  $self.startDrop = ->
    _isKeepDrop = true
    if amount > 1
      caro.loop(->
        createDrop()
      , 1, amount)
    else
      createDrop()
    trigger1 = 'focusout.cfRandomDrop'
    trigger2 = 'focus.cfRandomDrop'
    $window.on(trigger1, ->
      _isKeepDrop = false
      return
    )
    $window.on(trigger2, ->
      $self.startDrop()
      return
    )
    $self

  ### 停止產生滑落物件 ###
  $self.stopDrop = ->
    _isKeepDrop = false
    $self

  ### 當 click 時, 產生滑落物件 ###
  $self.clickCreate = ->
    triggerName = 'click.cfRandomDrop'
    $self.on(triggerName, (e) ->
      mouseX = e.pageX
      mouseY = e.pageY
      selfOffset = $self.offset()
      left = mouseX - selfOffset.left
      top = mouseY - selfOffset.top
      createDrop(
        left: left
        top: top
        isKeepDrop: false
      )
    )
    $self

  ### 當 mousemove, 產生滑落物件 ###
  $self.moveCreate = (interval = 10) ->
    count = 0
    interval = parseInt(interval, 10) or 10
    triggerMoveFn = (e) ->
      return if ++count % interval isnt 0
      count = 0
      targetTouches = e.originalEvent and e.originalEvent.targetTouches or [{}]
      mouseX = e.pageX or targetTouches.pageX
      mouseY = e.pageY or targetTouches.pageY
      offset = $self.offset()
      left = mouseX - offset.left
      top = mouseY - offset.top
      createDrop(
        left: left
        top: top
        isKeepDrop: false
      )
    triggerName1 = 'mousemove.cfRandomDrop'
    triggerName2 = 'touchmove.cfRandomDrop'
    $self.on(triggerName1, triggerMoveFn)
    $self.on(triggerName2, triggerMoveFn)
    $self

  $self.css(
    position: 'relative'
  )