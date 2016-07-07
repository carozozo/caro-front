### 客製化 facebook api 呼叫程式 ###
cf.regServ 'fb', (cf) ->
  self = {}
  caro = cf.require('caro')
  window = cf.require('window')
  _cfg = cf.config('fb')
  _appId = _cfg.appId
  _redirectAfterLogin = _cfg.redirectAfterLogin
  _shareUrl = _cfg.shareUrl
  _initCbMap = {}
  _isReady = false
  ### https://developers.facebook.com/docs/facebook-login/permissions ###
  _isUserConnected = false
  _authResponse = {}
  _trace = cf.genTraceFn('fb')
  #  _trace.startTrace()

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
      version: 'v2.6'
    caro.forEach _initCbMap, (cb, name) ->
      _trace 'Execute callback: ', name
      cb()
      return
    _isReady = true
    return

  runFb = (fn) ->
    unless _isReady
      return cf.alert('Facebook 登入功能正在準備中, 請稍後再試')
    unless FB
      return cf.alert('Facebook 功能異常, 請稍後再試')
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

  initLoginResponseAncCallCb = (res, sucCb, errCb) ->
    _trace 'Login response =', res
    if !res
      cf.alert 'Facebook 功能異常, 請稍後再試'
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

  getFbLoginUrl = ->
    urlArr = ['https://']
    pageAfterLogin = cf.website.getIndexUrl()
    urlArr.push if cf.isPhone then 'm' else 'www'
    urlArr.push '.facebook.com/dialog/oauth?client_id=' + _appId + '&scope=&auth_type=rerequest'
    if _redirectAfterLogin
      pageAfterLogin += _redirectAfterLogin + '.html'
    urlArr.push '&redirect_uri=' + pageAfterLogin
    urlArr.join ''

  getPermissions = ->
    _trace 'Start getPermissions'
    FB.api '/me/permissions', (res) ->
    return

  self.regInitCb = (name, cb) ->
    if !_initCbMap[name]
      _initCbMap[name] = cb
      _trace 'Init callback: ' + name + ' registered'
    else
      _trace 'Init callback: ' + name + ' is duplicate'
    return

  self.isReady = ->
    _isReady

  self.getAppId = ->
    _appId

  self.getUserId = ->
    _trace 'Start getUserId'
    userId = _authResponse.userID
    return userId if userId
    null

  self.getAccessToken = ->
    _trace 'Start getAccessToken'
    accessToken = _authResponse.accessToken
    return accessToken if accessToken
    null

  self.getLoginStatus = (cb) ->
    _trace 'Start getLoginStatus'
    runFb(->
      FB.getLoginStatus (res) ->
        initLoginResponseAncCallCb res
        cb and cb()
        return
    )
    return

  self.login = (opt) ->
    # https://developers.facebook.com/docs/reference/javascript/FB.login/v2.6
    _trace 'Start login'
    runFb((apiObj) ->
      if _isUserConnected
        apiObj.suc = (cb) ->
          cb and cb()
          apiObj
        return
      if cf.isPhone
        url = getFbLoginUrl()
        window.open url, '_top'
        return
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

  self.logout = ->
    _trace 'Start logout'
    runFb((apiObj) ->
      FB.logout (res) ->
        initLoginResponseAncCallCb res, apiObj.sucCb, apiObj.errCb
        return
    )

  self.getProfile = (fieldArr) ->
    ### https://developers.facebook.com/docs/graph-api/reference/user ###
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

  self.feed = (opt) ->
    ### https://developers.facebook.com/docs/sharing/reference/feed-dialog/v2.5 ###
    _trace 'Start feed'
    runFb((apiObj) ->
      $ = cf.require('$')
      param = opt or {}
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
      param.link = _shareUrl or cf.website.getIndexUrl()
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

  window.fbAsyncInit = ->
    init()
    self.getLoginStatus()
    return

  self

cf.regDocReady 'fb', (cf) ->
  _cfg = cf.config('fb')
  _isDownloadSdk = _cfg.isDownloadSdk
  _trace = cf.genTraceFn('fb')
  # _trace.startTrace()

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