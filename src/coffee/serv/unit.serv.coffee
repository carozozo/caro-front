### 一些單元程式 ###
cf.regServ 'unit', (cf) ->
  self = {}
  caro = cf.require('caro')
  window = cf.require('window')
  $ = cf.require('$')
  _trace = cf.genTraceFn('unit')
  #  _trace.startTrace()

  do cookie = ->
    genCookieName = (name) ->
      'TheIndex_' + name

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

  do unit = ->
    self.getImgSize = ($img, cb) ->
      ### 取得圖片真實大小 ###
      $('<img/>').attr('src', $img.attr('src')).load ->
        cb width: @width height: @height
        return
      return

    self.coverArrIfNot = (arr) ->
      if caro.isArray(arr) then arr else [arr]
    return

  do dom = ->
    self.ifJquery = (tar) ->
      ### 是否為 jQuery 物件 ###
      tar instanceof jQuery

    self.coverDomList = ($domList, cb) ->
      ###
      # 轉換成 dom list
      # e.g. $('#dom') => [$('#dom')]
      # e.g. $('.domList') => [$dom1, $dom2....]
      ###
      $list = []
      caro.reduce $domList, (($list, $dom, i) ->
        $dom = if self.ifJquery($dom) then $dom else $($dom)
        $list[i] = $dom
        cb and cb($dom, i)
        $list
      ), $list
      $list

    self.replaceImgPath = ($target) ->
      ### 轉換圖片路徑 ###
      hasHttp = (str) ->
        index = str.indexOf('http://')
        index2 = str.indexOf('https://')
        return index if index > -1
        return index2 if index2 > -1
        null
      $target.find('*').each((i, $dom) ->
        $dom = $($dom)
        # 置換圖片路徑
        src = $dom.attr('src')
        if src and src.indexOf('images/') > -1
          src = src.replace('images/', '')
          $dom.attr('src', cf.website.getImgUrl(src))
        # 置換背景圖片路徑
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