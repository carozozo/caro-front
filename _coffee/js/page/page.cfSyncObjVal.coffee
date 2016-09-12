cf.router.regPage 'module/cfSyncObjVal', (cf) ->
  $page = @
  window = cf.require('window')
  $ = cf.require('$')

  obj =
    a: 1
    b: 2
  $target = $page.dom('#target')
  targetHtml = $target.html()
  $otherBtnsBox = $page.dom('#otherBtnsBox').hide()
  $page.dom('#setBtn1').onClick(->
    $target.cfWatch(obj)
    $otherBtnsBox.show()
  )
  $page.dom('#setBtn2').onClick(->
    obj.a = 'Caro'
  )
  $page.dom('#setBtn3').onClick(->
    obj.b = 'Front'
  )
  $page.dom('#setBtn4').onClick(->
    obj.a = null
  )
  $page.dom('#resetBtn').onClick(->
    $target.html(targetHtml)
  )

  $page