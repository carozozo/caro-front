### 自定義 api ###
cf.regServ 'api', (cf) ->
  self = {}
  _ajax = cf.ajax

  self.demoPostApi = (data) ->
    _ajax.callAjax 'DemoPostApi', data

  self.demoGetApi = ->
    _ajax.callAjax 'DemoGetApi'

  self.captcha = ->
    url = cf.indexUrl + 'api/Captcha.'
    url += if cf.isLocal then 'png' else 'ashx'
    ### 尾數加上日期, 強制更新 ###
    return url + '?v=' + new Date().getTime()

  self

cf.regDocReady(->
  ### 設置假的 response for 沒有 api 測試 ###
  cf.ajax.setFakeResponse(
    ### {{Api 名稱}} : {{假的 response}} ###
    DemoPostApi:
      error_message: null
      responseObject: {}
    DemoGetApi:
      error_message: null
      responseObject: {}
  )
  return
)