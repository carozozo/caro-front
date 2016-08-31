###
客製化 facebook api 呼叫程式
###
cf.regServ 'fb', (cf) ->
  self = {}
  caro = cf.require('caro')
  window = cf.require('window')
  _cfg = cf.config('fb')
  _isPhone = cf.isPhone
  _appId = _cfg.appId
  _sdkVersion = _cfg.sdkVersion
  _redirectAfterLogin = _cfg.redirectAfterLogin
  _shareUrl = _cfg.shareUrl
  _initCbMap = {}
  _isReady = false
  ### https://developers.facebook.com/docs/facebook-login/permissions ###
  _isUserConnected = false
  _authResponse = {}
  _nowUrl = cf.nowUrl
  ### 取得登入 FB 後要跳轉的網址 ###
  _urlAftLogin = do ->
    urlArr = ['https://']
    urlArr.push if _isPhone then 'm' else 'www'
    urlArr.push '.facebook.com/dialog/oauth?client_id=' + _appId + '&scope=&auth_type=rerequest'
    pageAfterLogin = if _redirectAfterLogin then caro.addTail(_redirectAfterLogin, '.html') else _nowUrl
    urlArr.push '&redirect_uri=' + pageAfterLogin
    urlArr.join('')

  _trace = cf.genTraceFn('fb')

  genApiObj = ->
    obj = {}
    obj.suc = (cb) ->
      obj.sucCb = cb
      obj
    obj.err = (cb) ->
      obj.errCb = cb
      obj
    obj

  init = ->
    _trace 'Start init:', _appId
    FB.init
      appId: _appId
      status: true
      cookie: true
      xfbml: true
      version: _sdkVersion
    caro.forEach _initCbMap, (cb, name) ->
      _trace 'Execute callback: ', name
      cb()
      return
    _isReady = true
    return

  runFb = (fn) ->
    unless _isReady
      return alert('Facebook 登入功能正在準備中, 請稍後再試')
    unless FB
      return alert('Facebook 功能異常, 請稍後再試')
    apiObj = genApiObj()
    fn(apiObj)
    apiObj

  getFbResErrObj = (res) ->
    if res.error or res.error_message or res.error_code
      return {
      err: res.error
      code: res.error_code
      msg: res.error_message
      }
    null

  ### 判斷 login 狀況並呼叫相關 cb ###
  initLoginResponseAncCallCb = (res, sucCb, errCb) ->
    _trace 'Login response =', res
    if !res
      alert 'Facebook 功能異常, 請稍後再試'
      _trace.err 'Can not get Fb login response'
      return errCb and errCb()
    resErrObj = getFbResErrObj(res)
    if resErrObj
      return errCb and errCb(resErrObj)
    status = res.status
    if status == 'connected'
      # Logged into your app and Facebook.
      _authResponse = res.authResponse
      _isUserConnected = true
      sucCb and sucCb()
      return
    if status == 'not_authorized'
      _isUserConnected = false
      _trace.err 'Is logged into Facebook, but not with app'
      return errCb and errCb(status)
    _isUserConnected = false
    _trace 'Is not logged into Facebook'
    return

  ### 註冊, 當 FB init 完成後要執行的 cb ###
  self.regInitCb = (name, cb) ->
    if !_initCbMap[name]
      _initCbMap[name] = cb
      _trace 'Init callback: ' + name + ' registered'
    else
      _trace 'Init callback: ' + name + ' is duplicate'
    return
  ### 判斷 FB 是否 ready ###
  self.isReady = ->
    _isReady
  ### 取得 FB APP id ###
  self.getAppId = ->
    _appId
  ### 取得 user id ###
  self.getUserId = ->
    _trace 'Start getUserId'
    userId = _authResponse.userID
    return userId if userId
    null
  ### 取得 user token ###
  self.getAccessToken = ->
    _trace 'Start getAccessToken'
    accessToken = _authResponse.accessToken
    return accessToken if accessToken
    null
  ### 取得登入狀態 ###
  self.getLoginStatus = ->
    ### https://developers.facebook.com/docs/reference/javascript/FB.getLoginStatus/ ###
    _trace 'Start getLoginStatus'
    runFb((apiObj) ->
      FB.getLoginStatus (res) ->
        initLoginResponseAncCallCb res, apiObj.sucCb, apiObj.errCb
        return
      , true
    )
    return
  ### 登入 ###
  self.login = (opt) ->
    ### https://developers.facebook.com/docs/reference/javascript/FB.login/ ###
    _trace 'Start login'
    runFb((apiObj) ->
      if _isUserConnected
        apiObj.suc = (cb) ->
          cb and cb()
          apiObj
        return
      return window.open _urlAftLogin, '_top' if _isPhone
      opt = if opt then caro.assign(
        'scope': ''
        'return_scopes': true
        'auth_type': 'rerequest'
      , opt
      ) else {}
      FB.login ((res) ->
        initLoginResponseAncCallCb res, apiObj.sucCb, apiObj.errCb
        return
      ), opt
    )
  ### 登出 ###
  self.logout = ->
    ### https://developers.facebook.com/docs/reference/javascript/FB.logout/ ###
    _trace 'Start logout'
    runFb((apiObj) ->
      FB.logout (res) ->
        initLoginResponseAncCallCb res, apiObj.sucCb, apiObj.errCb
        return
    )
  ### 取得 user 資料 ###
  self.getProfile = (fieldArr) ->
    ### https://developers.facebook.com/docs/graph-api/reference/user/ ###
    _trace 'Start getProfile'
    runFb((apiObj) ->
      fieldArr = [
        'id'
        'name'
        'email'
        'gender'
      ].concat(fieldArr or [])
      FB.api '/me', {fields: fieldArr.join(',')}, (res) ->
        return _trace.err('Get profile failed') unless res
        resErrObj = getFbResErrObj(res)
        return apiObj.errCb and apiObj.errCb(resErrObj) if resErrObj
        apiObj.sucCb and apiObj.sucCb(res)
        return
    )
  ### 分享內容 ###
  self.feed = (opt = {}) ->
    ### https://developers.facebook.com/docs/sharing/reference/feed-dialog/ ###
    _trace 'Start feed'
    runFb((apiObj) ->
      $ = cf.require('$')
      param = opt
      displayArr = [
        'popup'
        'dialog'
        'iframe'
        'touch'
        'async'
        'hidden'
        'none'
      ]
      param.method = 'feed'
      param.link = _shareUrl or _nowUrl
      param.caption = param.caption or param.link
      if param.display and displayArr.indexOf(param.display) < 0
        delete param.display
      _trace 'Feed param =', param
      FB.ui param, (res) ->
        _trace 'Feed response:', res
        return _trace.err('Feed failed') unless res
        resErrObj = getFbResErrObj(res)
        return apiObj.errCb and apiObj.errCb(resErrObj) if resErrObj
        apiObj.sucCb and apiObj.sucCb(res)
        return
    )

  ### 當 FB 的 script 被置入後, 會呼叫此程式 ###
  window.fbAsyncInit = ->
    init()
    self.getLoginStatus()
    return

  self

cf.regDocReady((cf) ->
  _cfg = cf.config('fb')
  _isDownloadSdk = _cfg.isDownloadSdk
  _trace = cf.genTraceFn('fb')

  downloadSdk = ->
    _trace 'Start download facebook SDK'
    ((d, s, id) ->
      js = undefined
      fjs = d.getElementsByTagName(s)[0]
      if d.getElementById(id)
        return
      js = d.createElement(s)
      js.id = id
      js.src = '//connect.facebook.net/zh_TW/sdk.js'
      fjs.parentNode.insertBefore js, fjs
      return) document, 'script', 'facebook-jssdk'
    return

  downloadSdk() if _isDownloadSdk
  return
)