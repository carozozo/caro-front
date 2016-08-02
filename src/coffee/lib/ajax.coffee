### 客製化的 ajax 程式, 可使用假資料測試以及簡化呼叫方式 ###
cf.regLib 'ajax', (cf) ->
  self = {}
  $ = cf.require('$')
  caro = cf.require('caro')
  _cfg = cf.config('ajax')
  _responseErrKey = _cfg.responseErrKey
  _isTest = cf.isLocal or _cfg.isTestMode
  _errMsg = _cfg.errMsg
  _indexUrl = cf.indexUrl
  _alert = cf.alert or cf.require('alert')

  generateApiUrl = (apiName) ->
    apiUrl = _indexUrl + 'api/'
    apiUrl += apiName + '.ashx'
    apiUrl

  generateAjaxOpt = (url, data, extendOpt) ->
    opt =
      url: url
      type: 'GET'
    if data
      opt.type = 'POST'
      opt.data = data
    caro.assign opt, extendOpt or {}

  ### 呼叫 ajax, 測試模式時會調用 fakeResponse ###
  self.callAjax = (apiName, data, ajaxOpt = {}) ->
    ajaxObj = null
    if _isTest
      ajaxObj = {}
      ajaxObj.suc =
        ajaxObj.success = (cb) ->
          fakeRes = ajaxOpt.fakeResponse
          cb and cb(fakeRes)
          ajaxObj
      ### 在測試模式時, error 和 err 不會執行 cb ###
      ajaxObj.err = ajaxObj.error = -> return ajaxObj
      return ajaxObj

    url = generateApiUrl(apiName)
    opt = generateAjaxOpt(url, data, ajaxOpt)
    ajaxObj = $.ajax(opt)

    ### 成功取得 response, 且裡面沒有 error, 則直接 cb(response) ###
    ajaxObj.suc = (cb) ->
      ajaxObj.success (res) ->
        resErr = res[_responseErrKey]
        if caro.isObject(res) and !resErr
          cb and cb(res)
        return

    # 成功取得 response, 且裡面有 error, 則直接 cb(response.error)
    ajaxObj.err = (cb) ->
      ajaxObj.success (res) ->
        resErr = res[_responseErrKey]
        if caro.isObject(res) and resErr
          cb and cb(resErr)
        return

    ### 如果呼叫 ajax 發生錯誤, 顯示要 alert 的訊息 ###
    ajaxObj.error(->
      _alert(_errMsg) if _errMsg
      return
    )

    ajaxObj

  self