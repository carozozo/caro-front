cf.router.regPage 'module/cfMouseStyle', (cf, $page) ->
  $mouseArea = $page.dom('#mouseArea').css(
    height: 300
  )
  $mouse = $page.dom('#mouse').src('images/hand.png').css(
    'z-index': 100
  )
  $mouseArea.cfMouseStyle($mouse)
  $page