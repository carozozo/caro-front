### 客製化的 ajax 程式, 可使用假資料測試以及簡化呼叫方式 ###
cf.regLib 'ajax', (cf) ->
  self = {}
  $ = cf.require('$')
  caro = cf.require('caro')
  _cfg = cf.config('ajax')
  _responseErrKey = _cfg.responseErrKey
  _isTestMode = _cfg.isTestMode
  _fakeResponse = null

  ifTestMode = ->
    cf.isLocal or _isTestMode

  generateApiUrl = (apiName) ->
    apiUrl = cf.website.getIndexUrl() + 'api/'
    apiUrl += apiName + '.ashx'
    apiUrl

  generateAjaxOpt = (url, data, extendOpt) ->
    opt =
      url: url
      type: 'POST'
      dataType: 'json'
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8'
      data: data or {}
    caro.assign opt, extendOpt or {}

  ### 設置測試用的假 response ###
  self.setFakeResponse = (fakeRes) ->
    _fakeResponse = fakeRes
    return

  ### 呼叫 ajax, 測試模式時會調用 fakeResponse ###
  self.callAjax = (apiName, data, ajaxOpt) ->
    ajaxObj = null
    if ifTestMode()
      ajaxObj = {}
      ajaxObj.suc =
        ajaxObj.success = (cb) ->
          fakeRes = _fakeResponse[apiName]
          cb and cb(fakeRes)
          ajaxObj

      ### 在測試模式時, error 和 err 不會執行 cb ###
      ajaxObj.err =
        ajaxObj.error = ->
          ajaxObj

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

    ajaxObj

  ### 取得 template 頁面 ###
  self.getPage = (pageName, opt = {}) ->
    pageName = caro.addTail(pageName, '.html')
    ajaxObj = caro.assign({type: 'GET'}, opt)
    ajaxObj.url = cf.website.getIndexUrl() + 'template/' + pageName
    $.ajax ajaxObj

  self