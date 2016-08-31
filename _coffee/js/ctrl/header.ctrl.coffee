### 有搭配 .html 的 ctrl, 觸發時會讀取 template/ctrl/header.html 檔並寫入 template ###
cf.regCtrl 'header', ->
  $self = @
  cf = $self.cf
  tl = cf.require('TimelineMax')
  tm = cf.require('TweenMax')
  bgColorArr = cf.data('bgColorArr')

  setBgColor = ->
    color = caro.randomPick(bgColorArr)
    tm.to($header, 1
      backgroundColor: color
    )
    return

  $header = $self.dom()
  $headerTitle = $self.dom('#headerTitle', ($headerTitle) ->
    $headerTitle.onClick(->
      cf.router.goPage('index')
      return
    )
    $headerTitleImg = $headerTitle.dom('.headerTitleImg')
    $headerTitle.start = ->
      titleWidth = $headerTitleImg.width()
      titleHeight = $headerTitleImg.height()
      pieceContainerArr = []
      setPieceContainer = ($container) ->
        $container.width(titleWidth)
        $container.height(titleHeight)
        pieceContainerArr.push($container)
        $container
      showContainer = (index)->
        caro.forEach(pieceContainerArr, ($container, i) ->
          return $container.show() if i is index
          $container.hide()
          return
        )
        return

      $img1 = $headerTitleImg.clone().appendTo($headerTitle).cfPiece(1, 100)
      setPieceContainer($img1.$pieceContainer)
      $pieceArr1 = $img1.$pieceArr

      $img2 = $headerTitleImg.clone().appendTo($headerTitle).cfPiece(20, 1)
      setPieceContainer($img2.$pieceContainer)
      $pieceArr2 = $img2.$pieceArr

      yPiece = 6
      xPiece = 16
      $img3 = $headerTitleImg.clone().appendTo($headerTitle).cfPiece(yPiece, xPiece)
      setPieceContainer($img3.$pieceContainer)
      $pieceArr3 = $img3.$pieceArr

      $headerTitleImg.hide()

      action1 = ->
        showContainer(0)
        tm.staggerFromTo($pieceArr1, .5, {
          rotationX: 0
        }, {
          rotationX: 360
        }, .005)
        return
      action2 = ->
        showContainer(0)
        caro.forEach($pieceArr1, ($piece, i) ->
          x = if i % 2 is 0 then -5 else 5
          tl1 = new tl()
          tl2 = new tl(
            repeat: 1
          )
          tl1.to($piece, .2,
            x: x
          ).to($piece, .2,
            x: 0
          )
          .add(
            tl2.to($piece, .1,
              x: x
            ).to($piece, .1,
              x: 0
            )
          , '+=1')
          return
        )
        return
      action3 = ->
        showContainer(0)
        tl1 = new tl()
        tl1.staggerTo($pieceArr1.reverse(), .3, {
          x: 10
          bezier: [{y: -5}, {y: 0}]
        }, .01)
        .staggerTo($pieceArr1.reverse(), .3, {
          x: 0
          bezier: [{y: 5}, {y: 0}]
        }, .01)
        return
      action4 = ->
        showContainer(1)
        tm.staggerFromTo($pieceArr2, .5, {
          rotationY: 0
        }, {
          rotationY: 360
        }, .005)
        return
      action5 = ->
        showContainer(1)
        caro.forEach($pieceArr2, ($piece, i) ->
          y = if i % 2 is 0 then -5 else 5
          tl1 = new tl()
          tl2 = new tl(
            repeat: 1
          )
          tl1.to($piece, .2,
            y: y
          ).to($piece, .2,
            y: 0
          )
          .add(
            tl2.to($piece, .1,
              y: y
            ).to($piece, .1,
              y: 0
            )
          , '+=1')
          return
        )
        return
      action6 = ->
        showContainer(1)
        tl1 = new tl(
          onComplete: ->
            $pieceArr2.reverse()
            return
        )
        tl1.staggerTo($pieceArr2, .3, {
          y: -5
        }, .05)
        .staggerTo($pieceArr2.reverse(), .3, {
          y: 0
        }, .05)
        return
      action7 = ->
        showContainer(2)
        tm.staggerFromTo($pieceArr3, .5, {
          rotationY: 0
        }, {
          rotationY: 360
        }, .005)
        return
      action8 = ->
        showContainer(2)
        caro.forEach($pieceArr3, ($piece) ->
          yIndex = $piece._yIndex
          xIndex = $piece._xIndex
          y = (yIndex - yPiece / 2)
          x = (xIndex - xPiece / 2)
          tl1 = new tl()
          tl1.to($piece, .5,
            x: x
            y: y
          ).to($piece, .2,
            x: 0
            y: 0
          , '+=0.1')
          return
        )
        return
      actionArr = [action1, action2, action3, action4, action5, action6, action7, action8]
#      actionArr = [action3]
      caro.setInterval(->
        caro.randomPick(actionArr)()
      , 5000)
      caro.randomPick(actionArr)()
      return
    return
  )
  $headerBtn = $self.dom('.headerBtn')

  tl1 = new tl(
    onComplete: ->
      $headerTitle.start()
      return
  )
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

  cf.router.regPrePage(setBgColor)
  setBgColor()
  $self
, 'template/ctrl/header.html'

cf.regDocReady (cf) ->
  cf.router.blockGoPage()
  $ = cf.require('$')
  $('#header').header()
  return