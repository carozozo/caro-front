### 自定義 api ###
cf.regServ 'api', (cf) ->
  self = {}
  _cfg = cf.config('ajax')
  _isTest = cf.isLocal or _cfg.isTestMode
  _ajax = cf.ajax

  self.demoPostApi = (data) ->
    _ajax.callAjax 'DemoPostApi', data,
      fakeResponse:
        error_message: null
        responseObject: {}

  self.demoGetApi = ->
    _ajax.callAjax 'DemoGetApi', null,
      fakeResponse:
        error_message: null
        responseObject: {}

  self.captcha = ->
    url = cf.indexUrl + 'api/Captcha.'
    url += if(_isTest) then 'png' else 'ashx'
    ### 尾數加上日期, 強制更新 ###
    return url + '?v=' + new Date().getTime()

  self