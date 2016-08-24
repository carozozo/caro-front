cf.router.regPage 'module/cfMouseStyle', (cf, $page) ->
  $mouseArea = $page.dom('#mouseArea').css(
    height: 300
  )
  $mouse = $page.dom('#mouse').src('images/hand.png')
  $mouseArea.cfMouseStyle($mouse)
  $page