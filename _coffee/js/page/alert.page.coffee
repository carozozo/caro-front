cf.router.regPage 'lib/alert', ->
  $page = @

  $page.dom('#alertBtn').onClick(->
    cf.alert('''
    這是 Alert 訊息<br/>
    by CaroFront
    ''')
    return
  )

  $page
