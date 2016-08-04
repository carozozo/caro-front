cf.router.regPage 'view', (cf, $page) ->
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
    x: -100
  , .3)

  setTimeout ->
    return if cf.data('view')
    cf.data('view', true)
    searchObj = cf.router.parseUrlSearch()
    cf.alert(JSON.stringify(searchObj)) if searchObj
    return
  , 1000

  _tracking.page('view')
  $page