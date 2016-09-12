cf.router.regPage 'lib/routeAnimate', (cf) ->
  $page = @
  window = cf.require('window')
  $page

cf.router.regBefPage ->
  fnArr = []
  caro = cf.require('caro')
  caro.forEach(cf.routeAnimate, (fn, fnName) ->
    fnArr.push(fnName)
  )
  fn = caro.randomPick(fnArr)
  cf.routeAnimate[fn]()
  return