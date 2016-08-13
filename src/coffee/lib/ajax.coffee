### 客製化的 ajax 程式, 可使用假資料測試以及簡化呼叫方式 ###
cf.regLib 'ajax', (cf) ->
  self = {}
  $ = cf.require('$')
  caro = cf.require('caro')
  _cfg = cf.config('ajax')
  _responseErrKey = _cfg.responseErrKey
  _isTest = cf.isLocal or _cfg.isTestMode
  _errMsg = _cfg.errMsg
  _alert = cf.alert or cf.require('alert')

  $loading = do ->
    $loading = $('<div/>').css(
      position: 'fixed'
      top: 0
      left: 0
      'background-color': 'rgba(0, 0, 0, 0.6)'
      width: '100%'
      height: '100%'
      'z-index': 9999
    )
    $loading.$msg = $('<div/>').css(
      'font-size': '1.5em'
      'text-align': 'center'
      color: '#fff'
    ).appendTo($loading)
    $loading.msgArr = ['Loading.', 'Loading..', 'Loading...']
    $loading.count = 0
    $loading

  generateAjaxOpt = (url, data, extendOpt) ->
    opt =
      url: url
      type: 'GET'
    if data
      opt.type = 'POST'
      opt.data = data
    caro.assign opt, extendOpt or {}

  showLoading = ->
    $loading.$msg.css
      'margin-top': cf.$window.height() / 2
    $loading.$msg.html($loading.msgArr[$loading.count])
    $loading.interval = setInterval ->
      $loading.count++
      $loading.count = 0 if $loading.count is $loading.msgArr.length
      $loading.$msg.html($loading.msgArr[$loading.count])
      return
    , 500
    $loading.appendTo(cf.$body).fadeIn()
    return

  hideLoading = ->
    setTimeout(->
      clearInterval $loading.interval
      $loading.fadeOut ->
        $loading.remove()
        return
    , 500)
    return

  ### 呼叫 ajax, 測試模式時會調用 opt.fakeResponse ###
  self.callAjax = (url, data, opt = {}) ->
    ### 是否隱藏 loading 畫面 ###
    showLoading() unless opt.isHideLoading
    if _isTest
      ajaxObj = {}
      ajaxObj.suc = ajaxObj.success = (cb) ->
        fakeRes = opt.fakeResponse
        cb and cb(fakeRes)
        ajaxObj
      ### 在測試模式時, error 和 err 不會執行 cb ###
      ajaxObj.err = ajaxObj.error = -> return ajaxObj
      return ajaxObj

    ajaxOpt = generateAjaxOpt(url, data, opt.ajaxOpt)
    ajaxObj = $.ajax(ajaxOpt)
    _sucCb = null
    _errCb = null

    ajaxObj.suc = (cb) ->
      _sucCb = cb
      ajaxObj

    ajaxObj.err = (cb) ->
      _errCb = cb
      ajaxObj

    ajaxObj.success (res) ->
      res = JSON.parse(res) if caro.isString(res)
      ### 如果有設置 errorKey, 而且回傳的是物件 ###
      if _responseErrKey and caro.isObject(res)
        resErr = res[_responseErrKey]
        unless resErr
          _sucCb and _sucCb(res)
        else
          _errCb and _errCb(resErr)
        return
      _sucCb and _sucCb(res)
      return

    ### 如果呼叫 ajax 發生錯誤, 顯示要 alert 的訊息 ###
    ajaxObj.error ->
      _alert(_errMsg) if _errMsg
      return

    ajaxObj.complete ->
      hideLoading() unless opt.isHideLoading
      return

    ajaxObj

  self