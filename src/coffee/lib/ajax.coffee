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

  generateAjaxOpt = (url, data, extendOpt) ->
    opt =
      url: url
      type: 'GET'
    if data
      opt.type = 'POST'
      opt.data = data
    caro.assign opt, extendOpt or {}

  ### 呼叫 ajax, 測試模式時會調用 opt.fakeResponse ###
  self.callAjax = (url, data, opt = {}) ->
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
      return unless caro.isObject(res) and _responseErrKey
      resErr = res[_responseErrKey]
      unless resErr
        _sucCb and _sucCb(res)
      else
        _errCb and _errCb(resErr)
      return

    ### 如果呼叫 ajax 發生錯誤, 顯示要 alert 的訊息 ###
    ajaxObj.error ->
      _alert(_errMsg) if _errMsg
      return

    ajaxObj

  self