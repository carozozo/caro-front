### 有搭配 .html 的 ctrl, 觸發時會讀取 template/ctrl/header.html 檔並寫入 template ###
cf.regCtrl 'header', ->
  $self = @
  tl = cf.require('TimelineMax')
  tm = cf.require('TweenMax')
  bgColorArr = cf.data('bgColorArr')

  setBgColor = ->
    color = cf.randomPick(bgColorArr)
    tm.to($header, 1
      backgroundColor: color
    )
    return

  $header = $self.dom()
  $headerTitle = $self.dom('#headerTitle', ($headerTitle) ->
    $headerTitle.onClick(->
      cf.router.goPage('index')
      return
    ).on('mouseenter', ->
      ### 不明確原因, 在 $headerTitle 裡面移動 mouseenter 會被多次觸發 ###
      return unless $headerTitle.isLeaved
      $headerTitle.isLeaved = false
      return
    ).on('mouseleave', ->
      $headerTitle.isLeaved = true
      return
    )
    $headerTitleImg = $headerTitle.dom('.headerTitleImg')
    $pieceMapArr = []
    $pieceContainerArr = []
    doPiece = (yPiece, xPiece) ->
      $pieceMap = {
        $pieceContainer: null
        $pieceArr: []
      }
      $headerTitleImg.show().cfPiece(yPiece, xPiece,
        aftPiece: ($piece, yIndex, xIndex) ->
          $piece.yIndex = yIndex
          $piece.xIndex = xIndex
          $pieceMap.$pieceArr.push($piece)
          return
      )
      $pieceContainer = $pieceMap.$pieceContainer = $headerTitleImg.$pieceContainer
      $pieceContainerArr.push($pieceContainer)
      $pieceMapArr.push($pieceMap)
      return
    doPiece(27, 1)
    doPiece(1, 25)
    doPiece(5, 5)

    effectArr = []
    effectArr.push(rotationX = ($pieceArr) ->
      tl1 = new tl()
      tl1.staggerFromTo($pieceArr, .5, {
        rotationX: 0
      }, {
        rotationX: 360
      }, .005)
      return
    )
    effectArr.push(rotationY = ($pieceArr) ->
      tl1 = new tl()
      tl1.staggerFromTo($pieceArr, .5, {
        rotationY: 0
      }, {
        rotationY: 360
      }, .005)
      return
    )
    effectArr.push(flashX = ($pieceArr) ->
      cf.forEach($pieceArr, ($piece) ->
        tl1 = new tl()
        tl1.to($piece, .2,
          x: cf.randomInt(10, -10)
        ).to($piece, .2,
          x: 0
        )
        return
      )
      return
    )
    effectArr.push(flashY = ($pieceArr) ->
      cf.forEach($pieceArr, ($piece, i) ->
        tl1 = new tl()
        tl1.to($piece, .2,
          y: cf.randomInt(10, -10)
        ).to($piece, .2,
          y: 0
        )
        return
      )
      return
    )
    effectArr.push(detachX = ($pieceArr) ->
      cf.forEach($pieceArr, ($piece) ->
        tm.to($piece, .2,
          opacity: 0
          x: cf.randomInt(30, -30)
          delay: Math.random()
          onComplete: ->
            setTimeout(->
              tm.set($piece,
                opacity: 1
                x: 0
              )
            , 1000)
            return
        )
        return
      )
      return
    )
    effectArr.push(detachY = ($pieceArr) ->
      cf.forEach($pieceArr, ($piece) ->
        tm.to($piece, .1,
          opacity: 0
          y: cf.randomInt(30, -30)
          delay: Math.random()
          onComplete: ->
            setTimeout(->
              tm.set($piece,
                opacity: 1
                y: 0
              )
            , 1000)
            return
        )
        return
      )
      return
    )
    randomAnimation = ->
      effectFn = cf.randomPick(effectArr)
      $pieceMap = cf.randomPick($pieceMapArr)
      cf.forEach($pieceContainerArr, ($pieceContainer) ->
        $pieceContainer.hide()
        return
      )
      $pieceMap.$pieceContainer.show()
      effectFn($pieceMap.$pieceArr)
      return

    setInterval(randomAnimation, 3000)
    return
  )
  $headerBtn = $self.dom('.headerBtn')
  $headerBg = $self.dom('#headerBg')
  $headerBg.dom('.strip', ($strip) ->
    setStrip = ($dom, obj) ->
      tm.set($dom, obj)
    caro.loop(->
      $clone = $strip.clone()
      eachWidth = Math.random() * 10
      right = Math.random() * 300
      $clone = $strip.clone().appendTo($headerBg)
      setStrip($clone,
        width: eachWidth
        right: right
        opacity: Math.random()
      )
      tm.from($clone, 1,
        x: 300
        ease: Back.easeOut.config(3)
        delay: Math.random()
      )
    , 1, 50)
    $strips = $headerBg.dom('.strip')
    setInterval(->
      $strips.eachDom(($strip) ->
        setTimeout(->
          tm.to($strip, Math.random() + .5,
            right: Math.random() * 300
            ease: Back.easeOut.config(Math.random() * 3)
          )
          return
        ,Math.random() * 2000)
        return
      )
      return
    , 10000)
    $strip.remove()
  )


  tl1 = new tl()
  tl1.from($headerTitle, 1
    opacity: 0
    y: -50
    ease: Elastic.easeOut.config(1, 0.4)
  ).staggerFrom($headerBtn, .5
    opacity: 0
    x: -50
    ease: Back.easeOut.config(2)
  , .2)

  cf.router.regPrePage(->
    setBgColor()
    return
  )
  $self
, 'template/ctrl/header.html'

cf.regDocReady (cf) ->
  $ = cf.require('$')
  $('#header').header()
  return