### 一些單元程式 ###
cf.regLib 'unit', (cf) ->
  self = {}
  caro = cf.require('caro')
  window = cf.require('window')
  $ = cf.require('$')
  _trace = cf.genTraceFn('unit')
  #  _trace.startTrace()

  ### Cookie 相關 ###
  do ->
    genCookieName = (name) ->
      'TheIndex_' + name
    ### 設置 cookie ###
    self.setCookie = (cookieName, val, exdays) ->
      if caro.isUndefined(val)
        _trace.err('Can not set undefined to cookie:', cookieName)
        return
      expires = ((exdays) ->
        if !exdays
          return null
        exdays = if !caro.isNaN(parseInt(exdays)) then parseInt(exdays) else 1
        date = new Date
        date.setTime date.getTime() + exdays * 24 * 60 * 60 * 1000
        'expires=' + date.toUTCString()
        return)(exdays)
      path = '; path=' + cf.website.getIndexUrl()
      cookieStrArr = [genCookieName(cookieName) + '=' + caro.toJson(val)]
      caro.pushNoEmptyVal cookieStrArr.push(expires)
      cookieStrArr.push path
      window.document.cookie = cookieStrArr.join('; ')
      return
    ### 取得 cookie ###
    self.getCookie = (name) ->
      cookieArr = window.document.cookie.split(';')
      ret = ''
      caro.forEach cookieArr, (cookie) ->
        cookieArr = cookie.split('=')
        cookieName = cookieArr[0].trim()
        if cookieName != genCookieName(name)
          return true
        ret = JSON.parse(cookieArr[1])
        return
      ret
    return

  ### Unit 相關 ###
  do ->
    ### window.open 進階版 ###
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
    ### 取得圖片真實大小 ###
    self.getImgSize = ($img, cb) ->
      $('<img/>').attr('src', $img.attr('src')).load ->
        cb width: @width height: @height
        return
      return
    ### 轉換成 array ###
    self.coverArrIfNot = (arr) ->
      if caro.isArray(arr) then arr else [arr]
    return

  ### DOM 相關 ###
  do ->
    ### 是否為 jQuery 物件 ###
    self.ifJquery = (tar) ->
      tar instanceof jQuery
    ###
    轉換成 dom list
    e.g. $('#dom') => [$('#dom')]
    e.g. $('.domList') => [$dom1, $dom2....]
    ###
    self.coverDomList = ($domList, cb) ->
      $list = []
      caro.reduce $domList, (($list, $dom, i) ->
        $dom = if self.ifJquery($dom) then $dom else $($dom)
        $list[i] = $dom
        cb and cb($dom, i)
        $list
      ), $list
      $list
    ### 轉換圖片路徑 ###
    self.replaceImgPath = ($target) ->
      hasHttp = (str) ->
        index = str.indexOf('http://')
        index2 = str.indexOf('https://')
        return index if index > -1
        return index2 if index2 > -1
        null
      $target.find('*').each((i, $dom) ->
        $dom = $($dom)
        ### 置換圖片路徑 ###
        src = $dom.attr('src')
        if src and src.indexOf('images/') > -1
          src = src.replace('images/', '')
          $dom.attr('src', cf.website.getImgUrl(src))
        ### 置換背景圖片路徑 ###
        background = $dom.css('background')
        backgroundImage = $dom.css('background-image')
        if background
          index = hasHttp(background)
          if index isnt null
            url = background.substring(index, background.indexOf('")'))
        if(backgroundImage)
          index = hasHttp(background)
          if index isnt null
            url = background.substring(index, background.indexOf('")'))
        if(url)
          img = url.substr(url.lastIndexOf('/') + 1)
          $dom.css('background-image', 'url(' + cf.website.getImgUrl(img) + ')')
      )
      return
    return

  self