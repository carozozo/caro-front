### 一些網站支援程式 ###
cf.regLib 'website', (cf) ->
  caro = cf.require('caro')
  window = cf.require('window')
  location = cf.require('location')
  _cfg = cf.config('website') or {}

  self = {}
  self.imgUrl = _imgUrl = if _cfg.imgUrl then caro.addTail(_cfg.imgUrl, '/') else 'images/'

  ### 取得 images 路徑 ###
  self.getImgUrl = (imgFileName = '') ->
    imgFileName = imgFileName.replace('/', '') if imgFileName.indexOf('/') is 0
    _imgUrl + imgFileName.replace('images/', '')

  ### init ###
  do(_cfg, location) ->
    return if cf.isLocal
    redirectPhone = _cfg.redirectPhone
    if redirectPhone and cf.isPhone
      if(redirectPhone.indexOf('http') is 0)
        location.href = redirectPhone
        return
      redirectPhone = redirectPhone.replace('/', '') if redirectPhone.indexOf('/') is 0
      location.href = cf.indexUrl + redirectPhone
    return

  self