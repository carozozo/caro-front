cf.router.regPage 'lib/router', (cf) ->
  $page = @
  window = cf.require('window')
  _router = cf.router

  $page.dom('#getPageBtn').onClick(->
    alert(_router.getPageByHash())
  )
  $page.dom('#getSearchBtn').onClick(->
    alert(_router.getSearchByHash())
  )
  $page.dom('#getSearchObjBtn').onClick(->
    alert(JSON.stringify(_router.parseUrlSearch()))
  )
  $page.dom('#goPageBtn1').onClick(->
    _router.goPage('lib/router')
  )
  $page.dom('#goPageBtn2').onClick(->
    _router.goPage()
  )
  $page.dom('#goPageBtn3').onClick(->
    _router.goPage('lib/router?name=pikachu&age=200')
  )
  $page.dom('#blockGoPageBtn').onClick(->
    _router.blockGoPage()
    alert('現在無法換頁')
  )
  $page.dom('#approveGoPageBtn').onClick(->
    _router.approveGoPage()
    alert('現在允許換頁')
  )

  $page