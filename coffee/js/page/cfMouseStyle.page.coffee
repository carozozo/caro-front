cf.router.regPage 'module/cfMouseStyle', (cf, $page) ->
  $mouseDiv = $page.dom('#mouseDiv').css(
    height: 300
  )
  $mouse = $page.dom('#mouse').src('images/hand.png')
  $mouseDiv.cfMouseStyle($mouse)
  $page