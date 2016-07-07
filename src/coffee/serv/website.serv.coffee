### 一些網站支援程式 ###
cf.regLib 'website', (cf) ->
  self = {}
  caro = cf.require('caro')
  window = cf.require('window')
  location = window.location
  _cfg = cf.config('website')

  ### url 相關 ###
  do(_cfg) ->
    self.getImgUrl = (imgFileName = '') ->
      imgUrl = _cfg.imgUrl or 'images/'
      imgFileName = imgFileName.replace('/', '') if imgFileName.indexOf('/') is 0
      imgUrl + imgFileName.replace('images/', '')

    return

  ### window 相關 ###
  do(window) ->
    self.open = (url, specs, replace, msg) ->
      pop = null
      if(specs and replace)
        pop = window.open(url, specs, replace)
      else if(specs)
        pop = window.open(url, specs)
      else
        pop = window.open(url)
      setTimeout(->
        if !pop or pop.outerHeight is 0
          msg = msg or '您的瀏覽器已封鎖彈出視窗'
          return cf.alert(msg) if cf.alert
          alert(msg)
      , 25)
    return

  ### init ###
  do(_cfg, location) ->
    return if cf.isLocal
    redirectPhone = _cfg.redirectPhone
    if redirectPhone and cf.isPhone
      if(redirectPhone.indexOf('http') is 0)
        location.href = redirectPhone
        return
      redirectPhone = redirectPhone.replace('/', '') if redirectPhone.indexOf('/') is 0
      location.href = cf.router.indexUrl + redirectPhone
    return

  self