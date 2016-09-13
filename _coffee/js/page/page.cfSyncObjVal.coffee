cf.router.regPage 'module/cfSyncObjVal', (cf) ->
  $page = @
  window = cf.require('window')
  $ = cf.require('$')

  obj =
    a: 1
    b: 2
  $target = $page.dom('#target')
  targetHtml = $target.html()
  $startBox = $page.dom('#startBox')
  $resetBox = $page.dom('#resetBox').hide()
  $otherBtnsBox = $page.dom('#otherBtnsBox').hide()
  $page.dom('#startBtn').onClick(->
    $target.cfSyncObjVal(obj)
    $startBox.hide()
    $resetBox.show()
    $otherBtnsBox.show()
  )
  $page.dom('#setBtn1').onClick(->
    obj.a = 'Caro'
  )
  $page.dom('#setBtn2').onClick(->
    obj.a = null
  )
  $page.dom('#setBtn3').onClick(->
    obj.b = 'Front'
  )
  $page.dom('#setBtn4').onClick(->
    obj.b = undefined
  )
  $page.dom('#resetBtn').onClick(->
    obj.a = 1
    obj.b = 2
    $target.html(targetHtml)
    $startBox.show()
    $resetBox.hide()
    $otherBtnsBox.hide()
  )

  $page