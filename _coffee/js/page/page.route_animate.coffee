cf.router.regPage 'lib/routeAnimate', (cf) ->
  $page = @
  window = cf.require('window')
  $page

cf.router.regBefPage ->
  fnArr = []
  cf.forEach(cf.routeAnimate, (fn, fnName) ->
    fnArr.push(fnName)
  )
  fn = cf.randomPick(fnArr)
  cf.routeAnimate[fn]()
  return