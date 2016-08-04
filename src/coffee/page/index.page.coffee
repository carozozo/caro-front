cf.router.regPage 'index', (cf, $page) ->
  tm = cf.require('TweenMax')
  window = cf.require('window')
  caro = cf.require('caro')
  _tracking = cf.tracking

  $title = $page.dom('.title')
  $content = $page.dom('.content', ($content) ->
    $content.demo2Ctrl()
    return
  )

  tm.staggerFrom([$title, $content], .5,
    opacity: 0
    y: -50
  , .3)

  setTimeout ->
    return if cf.data('index')
    cf.data('index', true)
    search = cf.router.getSearchByHash()
    cf.alert(search) if search
    return
  , 1000

  _tracking.page('index')
  $page