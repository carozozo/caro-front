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
      $headerTitle.randomAnimation()
      return
    ).on('mouseleave', ->
      $headerTitle.isLeaved = true
      return
    )
    $headerTitleImg = $headerTitle.dom('.headerTitleImg')
    $headerTitle.randomAnimation = ->
      $pieceArr = []
      $reversePieceArr = []

      doPiece = (yPiece, xPiece) ->
        $headerTitleImg.$pieceContainer && $headerTitleImg.$pieceContainer.remove()
        $headerTitleImg.show().cfPiece(yPiece, xPiece,
          aftPiece: setPiece
        )
        return

      setPiece = ($piece, yIndex, xIndex) ->
        $piece.yIndex = yIndex
        $piece.xIndex = xIndex
        $pieceArr.push($piece)
        $reversePieceArr.unshift($piece)
        return

      effectArr = []
      effectArr.push(rotationX = ->
        tl1 = new tl()
        tl1.staggerFromTo($pieceArr, .5, {
          rotationX: 0
        }, {
          rotationX: 360
        }, .005)
        return
      )
      effectArr.push(rotationY = ->
        tl1 = new tl()
        tl1.staggerFromTo($pieceArr, .5, {
          rotationY: 0
        }, {
          rotationY: 360
        }, .005)
        return
      )
      effectArr.push(flashX = ->
        cf.forEach($pieceArr, ($piece, i) ->
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
      effectArr.push(flashY = ->
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
      effectArr.push(detachX = ->
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
      effectArr.push(detachY = ->
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
      actionArr = []
      actionArr.push(->
        doPiece(27, 1)
        effectFn = cf.randomPick(effectArr)
        effectFn()
        return
      )
      actionArr.push(->
        doPiece(1, 25)
        effectFn = cf.randomPick(effectArr)
        effectFn()
        return
      )
      actionArr.push(->
        doPiece(5, 5)
        effectFn = cf.randomPick(effectArr)
        effectFn()
        return
      )
      cf.randomPick(actionArr)()
      return
    return
  )
  $headerBtn = $self.dom('.headerBtn')

  tl1 = new tl()
  tl1.from($headerTitle, .5
    opacity: 0
    y: -10
    ease: Elastic.easeOut.config(1, 0.4)
    onComplete: ->
      cf.router.approveGoPage()
      cf.router.goPage()
      return
  ).staggerFrom($headerBtn, .5
    opacity: 0
    x: -50
    ease: Back.easeOut.config(2)
  , .2)

  cf.router.regPrePage(->
    setTimeout(->
      $headerTitle.randomAnimation()
      return
    , 2000)
    setBgColor()
    return
  )
  $self
, 'template/ctrl/header.html'

cf.regDocReady (cf) ->
  cf.router.blockGoPage()
  $ = cf.require('$')
  $('#header').header()
  return