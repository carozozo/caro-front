cf.router.regPage 'index', (cf, $page) ->
  tm = cf.require('TweenMax')
  tl = cf.require('TimelineMax')
  window = cf.require('window')
  caro = cf.require('caro')
  _tracking = cf.tracking

  $title = $page.dom('.title')
  $subContent = $page.dom('.subContent', ($subContent) ->
    $subContent.demo2Ctrl()
    return
  )

  tl1 = new tl()
  tl1.from($title, .5,
    opacity: 0
    y: -50
  ).staggerFrom($subContent, .5,
    opacity: 0
    x: -50
  , .3)

  setTimeout ->
    return if cf.data('index')
    cf.data('index', true)
    search = cf.router.getSearchByHash()
    cf.alert(search) if search
    return
  , 1500

  _tracking.page('index')
  $page