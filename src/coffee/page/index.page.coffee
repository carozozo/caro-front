cf.router.regPage 'index', (cf, $page) ->
  window = cf.require('window')
  caro = cf.require('caro')
  _tracking = cf.tracking

  _tracking.page('index')
  $page.commonPage()
  $page