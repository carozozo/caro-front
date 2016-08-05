cf.router.regPage 'cf', (cf, $page) ->
  window = cf.require('window')
  caro = cf.require('caro')
  _tracking = cf.tracking

  _tracking.page('cf')
  $page