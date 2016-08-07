cf.router.regPage 'cookie', (cf, $page) ->
  window = cf.require('window')

  $setCookieName = $page.dom('#setCookieName')
  $setCookieVal = $page.dom('#setCookieVal')
  $page.dom('#setCookieBtn').onClick(->
    cookieName = $setCookieName.val()
    cookieVal = $setCookieVal.val()
    if cookieName and cookieVal
      cf.cookie.setCookie(cookieName, cookieVal)
      cf.alert '設置成功'
  )
  $getCookieName = $page.dom('#getCookieName')
  $page.dom('#getCookieBtn').onClick(->
    cookieName = $getCookieName.val()
    if cookieName
      cookieVal = cf.cookie.getCookie(cookieName)
      cf.alert cookieVal
  )

  $page
