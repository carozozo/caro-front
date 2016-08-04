### 自定義 api ###
cf.regServ 'api', (cf) ->
  self = {}
  _cfg = cf.config('ajax')
  _isTest = cf.isLocal or _cfg.isTestMode
  _ajax = cf.ajax
  _indexUrl = cf.indexUrl

  generateApiUrl = (apiName) ->
    apiUrl = _indexUrl + 'api/'
    apiUrl += apiName + '.ashx'
    apiUrl

  self.demoPostApi = (data) ->
    url = generateApiUrl('DemoPostApi')
    _ajax.callAjax url, data,
      fakeResponse:
        error_message: null
        responseObject: {}

  self.demoGetApi = ->
    url = generateApiUrl('DemoGetApi')
    _ajax.callAjax url, null,
      fakeResponse:
        error_message: null
        responseObject: {}

  self.captcha = ->
    url = cf.indexUrl + 'api/Captcha.'
    url += if(_isTest) then 'png' else 'ashx'
    ### 尾數加上日期, 強制更新 ###
    return url + '?v=' + new Date().getTime()

  self