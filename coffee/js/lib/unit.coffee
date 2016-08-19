### 一些單元程式 ###
cf.regLib 'unit', (cf) ->
  $ = cf.require('$')
  caro = cf.require('caro')
  window = cf.require('window')
  location = cf.require('location')
  _cfg = cf.config('unit') or {}

  self = {}
  _imgPath = if _cfg.imgPath then caro.addTail(_cfg.imgPath, '/') else 'images/'

  ### window.open 進階版 ###
  self.open = () ->
    pop = null
    window.open.apply(window, arguments)
    setTimeout(->
      if !pop or pop.outerHeight is 0
        msg = '您的瀏覽器已封鎖彈出視窗'
        return cf.alert(msg) if cf.alert
        alert(msg)
    , 25)
    return

  ### 判斷是否為 jQuery 物件 ###
  self.ifJquery = (arg) ->
    arg instanceof jQuery

  ### 取得圖片真實寬高 ###
  self.getImgSize = ($img, cb) ->
    $('<img/>').attr('src', $img.attr('src')).load ->
      cb(@width, @height)
      return
    return

  ### 取得圖片路徑 ###
  self.getImgPath = (imgFileName = '') ->
    imgFileName = imgFileName.replace('/', '') if imgFileName.indexOf('/') is 0
    _imgPath + imgFileName

  ### 轉換 $dom 的圖片路徑, 由 css 設定的同樣有效 ###
  self.replaceImgPath = ($dom, imgPath = _imgPath) ->
    imgPath = caro.addTail(imgPath, '/')
    setFilePath = (path) ->
      fileName = path.substr(path.lastIndexOf('/') + 1)
      imgPath + fileName
    ### 置換圖片路徑 ###
    src = $dom.attr('src')
    $dom.attr('src', setFilePath(src)) if src
    ### 置換背景圖片路徑 ###
    background = $dom.css('background')
    backgroundImage = $dom.css('background-image')
    back = background or backgroundImage
    if back
      url = background.substring(back.indexOf('("') + 2, back.indexOf('")'))
      $dom.css('background-image', 'url(' + setFilePath(url) + ')') if url
    return

  self