cf.router.regPage 'index', (cf, $page) ->
  tm = cf.require('TweenMax')
  tl = cf.require('TimelineMax')
  window = cf.require('window')
  caro = cf.require('caro')
  _tracking = cf.tracking

  _tracking.page('index')
  $page