cf.router.regPage 'module/cfWheel', (cf) ->
  $page = @
  bgColorArr = cf.data('bgColorArr')

  $wheelInfo = $page.dom('#wheelInfo')
  $page.cfWheel((e) ->
    info = {
      isWheelDown: e.isWheelDown
      isWheelRight: e.isWheelRight
      wheelDistance: e.wheelDistance
      deltaY: e.deltaY
      deltaX: e.deltaX
    }
    info = JSON.stringify(info)
    $wheelInfo.html(info)
  )

  $page