cf.router.regPage 'index', (cf, $page) ->
  window = cf.require('window')
  caro = cf.require('caro')
  $ = cf.require('$')
  _tracking = cf.tracking

  _tracking.page('index')

  $page

cf.regDocReady ->
  $('#headerTitle').dom().onClick ->
    cf.router.goPage('index')
    return
  return

cf.router.regAftPage ->
  cf.unit.getImgSize($('#img'),(width,height)->
    console.log width
    console.log height
  )
  return