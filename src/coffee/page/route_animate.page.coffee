cf.router.regPage 'route_animate', (cf, $page) ->
  window = cf.require('window')
  _alert = cf.alert
  _routeAnimate = cf.routeAnimate

  $page.dom('#setLeftBtn').onClick(->
    _routeAnimate.left()
    _alert('設定換頁 left 效果')
  )
  $page.dom('#setRightBtn').onClick(->
    _routeAnimate.right()
    _alert('設定換頁 right 效果')
  )
  $page.dom('#setScaleBtn').onClick(->
    _routeAnimate.scale()
    _alert('設定換頁 scale 效果')
  )
  $page.dom('#setFadeBtn').onClick(->
    _routeAnimate.fade()
    _alert('設定換頁 fade 效果')
  )
  $page.dom('#setClearBtn').onClick(->
    _routeAnimate.clear()
    _alert('清除換場效果')
  )

  $page