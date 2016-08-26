cf.router.regPage 'lib/routeAnimate', (cf, $page) ->
  window = cf.require('window')
  $page

cf.router.regBefPage ->
  fnArr = ['left','right','scale','fade','clear']
  fn = caro.randomPick(fnArr)
  cf.routeAnimate[fn]()
  return