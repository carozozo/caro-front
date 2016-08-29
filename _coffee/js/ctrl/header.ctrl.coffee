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
  $headerTitle = $self.dom('#headerTitle', ($headerTitle)->
    $headerTitle.onClick(->
      cf.router.goPage('index')
      return
    )
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

  cf.router.regPrePage(setBgColor)
  setBgColor()
  $self
, 'template/ctrl/header.html'

cf.regDocReady (cf) ->
  cf.router.blockGoPage()
  $ = cf.require('$')
  $('#header').header()
  return