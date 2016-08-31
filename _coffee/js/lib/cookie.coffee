###
cookie 相關
###
cf.regLib 'cookie', (cf) ->
  self = {}
  caro = cf.require('caro')
  window = cf.require('window')
  document = cf.require('document')
  _trace = cf.genTraceFn('cookie')

  ### 設置 cookie ###
  self.setCookie = (cookieName, val, opt = {}) ->
    if caro.isUndefined(val)
      _trace.err('Can not set undefined to cookie:', cookieName)
      return
    _exdays = opt.exdays
    _path = opt.path
    _domain = opt.domain
    cookieStrArr = [cookieName + '=' + caro.toJson(val)]

    if(_exdays)
      _exdays = unless caro.isNaN(parseInt(_exdays)) then parseInt(_exdays) else 1
      date = new Date
      date.setTime date.getTime() + (_exdays * 24 * 60 * 60 * 1000)
      expires = 'expires=' + date.toUTCString()
      cookieStrArr.push(expires)
    if(_path)
      path = 'path=' + caro.addHead(_path, '/')
      cookieStrArr.push(path)
    if(_domain)
      domain = 'domain=' + _domain
      cookieStrArr.push(domain)
    document.cookie = cookieStrArr.join(';')
    return

  ### 取得 cookie ###
  self.getCookie = (name) ->
    cookieArr = document.cookie.split(';')
    ret = ''
    caro.forEach cookieArr, (cookie) ->
      cookieArr = cookie.split('=')
      cookieName = cookieArr[0].trim()
      return true if cookieName isnt name
      ret = JSON.parse(cookieArr[1])
      return
    ret

  self