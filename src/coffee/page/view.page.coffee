cf.router.regPage 'view', (cf, $page) ->
  tm = cf.require('TweenMax')
  window = cf.require('window')
  caro = cf.require('caro')
  _tracking = cf.tracking

  _tracking.page('view')
  $page