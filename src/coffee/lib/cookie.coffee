### cookie 相關 ###
cf.regLib 'cookie', (cf) ->
  self = {}
  caro = cf.require('caro')
  window = cf.require('window')
  document = cf.require('document')
  _trace = cf.genTraceFn('cookie')
  #  _trace.startTrace()

  genCookieName = (name) ->
    'CaroFront' + name

  ### 設置 cookie ###
  self.setCookie = (cookieName, val, exdays) ->
    if caro.isUndefined(val)
      _trace.err('Can not set undefined to cookie:', cookieName)
      return

    if(exdays)
      exdays = unless caro.isNaN(parseInt(exdays)) then parseInt(exdays) else 1
      date = new Date
      date.setTime date.getTime() + (exdays * 24 * 60 * 60 * 1000)
      expires = 'expires=' + date.toUTCString()

    path = '; path=' + cf.indexUrl
    cookieStrArr = [genCookieName(cookieName) + '=' + caro.toJson(val)]
    caro.pushNoEmptyVal cookieStrArr.push(expires)
    cookieStrArr.push path
    document.cookie = cookieStrArr.join('; ')
    return

  ### 取得 cookie ###
  self.getCookie = (name) ->
    cookieArr = document.cookie.split(';')
    ret = ''
    caro.forEach cookieArr, (cookie) ->
      cookieArr = cookie.split('=')
      cookieName = cookieArr[0].trim()
      if cookieName isnt genCookieName(name)
        return true
      ret = JSON.parse(cookieArr[1])
      return
    ret

  self