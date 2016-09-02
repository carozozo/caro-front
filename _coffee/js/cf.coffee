###
CaroFront 核心程式
###
do(window, $, caro) ->
  self = {}
  ### 儲存從 config 讀取到的設定  ###
  self.$$config = {}
  ### 儲存資料, 類似 cookie, 但頁面刷新後會清空  ###
  self.$$data = {}
  ### 同 $(window)  ###
  self.$window = $(window)
  ### 同 $(document)  ###
  self.$document = $(document)
  ### 同 $('body')  ###
  self.$body = {}
  ### 是否為 localhost ###
  self.isLocal = false
  ### 是否為 local test 模式(由 config 設定) ###
  self.isLocalTest = false
  ### 用來判定目前所在的網址是否為 production ###
  self.isProd = false
  ### 當前網址是否為 https  ###
  self.isHttps = location.protocol.indexOf('https:') is 0
  ### 所在網址, 不包含 protocol, hash 和 search ###
  self.nowUrlPath = location.host + location.pathname
  ### 所在網址, 不包含 hash 和 search ###
  self.nowUrl = location.protocol + '//' + self.nowUrlPath

  ### 儲存 document ready 後要觸發的 fns, 裡面的 key 為執行順序 ###
  _docReady = {
    50: []
  }
  ### 儲存註冊的 controller fns ###
  _ctrl = {}
  ### 儲存註冊的 module fns ###
  _module = {}

  ###
  判斷 urlPath 是否需要完全符合, 並轉換 urlPath 為一般格式
  e.g. www.com.tw => isMustAllMatch = true, urlPath = 'www.com.tw/'
  e.g. www.com.tw* => isMustAllMatch = undefined, urlPath = 'www.com.tw/'
  ###
  ifUrlPathMustMatchAndGetUrl = (urlPath) ->
    indexOfStart = urlPath.lastIndexOf('*')
    urlLength = urlPath.length
    lastIndex = urlLength - 1
    if indexOfStart is lastIndex
      ### 如果 url 最後是* => 網址不需要完全符合 ###
      isMustAllMatch = true
      urlPath = urlPath.substring(0, lastIndex)
    urlPath = caro.addTail(urlPath, '/')
    {
      isMustAllMatch: isMustAllMatch
      urlPath: urlPath
    }

  genTraceFn = (traceName) ->
    fn = ->
      config = self.config('cf')
      trace = config.trace
      return unless trace
      return if caro.isString(trace) and traceName isnt trace
      return if caro.isArray(trace) and trace.indexOf(traceName) < 0
      name = caro.upperFirst(traceName)
      args = caro.values(arguments)
      args.unshift name + ':'
      console.log.apply console, args
      return

    fn.err = ->
      name = caro.upperFirst(name)
      args = caro.values(arguments)
      args.unshift name + ':'
      console.error.apply console, args
      return

    fn.startTrace = ->
      fn.traceMode = true
      return
    fn

  _trace = genTraceFn('cf')

  ### 核心程式 ###
  do(self, window) ->
    ### 載入 global 變數, 避免直接呼叫 global 變數以增加效能  ###
    self.require = (name) ->
      window[name]

    ### 寫入或讀取 data, 功能類似 config, 跨檔案存取資料使用 ###
    self.data = (key, val) ->
      return self.$$data[key] = val if typeof val isnt 'undefined'
      self.$$data[key]

    ### 註冊 document ready 要執行的 cb ###
    self.regDocReady = (fn, index = 50) ->
      _docReady[index] = [] unless _docReady[index]
      _docReady[index].push(fn)
      return

    ### 產生 trace 用的 fn, 會在 console 顯示訊息(IE8 之前不支援 console) ###
    self.genTraceFn = genTraceFn
    return

  ### 註冊 caro-front 物件 ###
  do(self) ->
    regAppObj = (type, name, fn) ->
      if !self[name]
        self[name] = fn self
        _trace type, name, 'registered'
        return
      _trace.err type, name, ' is duplicate'
      return

    ### 註冊 library ###
    self.regLib = caro.partial(regAppObj, 'lib')
    ### 註冊 service ###
    self.regServ = caro.partial(regAppObj, 'serv')
    return

  ### ctrl and module ###
  do(self, $) ->
    reg = (type, name, fn, page) ->
      return _trace.err(type, name, 'without function') if !fn
      typeObj = if type is 'ctrl' then _ctrl else _module
      _html = null
      if !typeObj[name] and !$.fn[name]
        typeObj[name] = $.fn[name] = ->
          $dom = this
          args = arguments
          $dom.cf = self
          if page and !_html
            sucCb = (html) ->
              _html = html
              $dom.html(_html)
              $dom = fn.apply $dom, args
              return
            errCb = ->
              _trace.err 'Can not get' + type + 'page:', page
              return
            jqxhr = $.ajax(page)
            ### jQuery 3.0 之後使用 done/fail 取代 success/error ###
            if jqxhr.done
              jqxhr.done(sucCb).fail(errCb)
            else
              jqxhr.success(sucCb).error(errCb)
          else
            $dom.html(_html) if _html
            $dom = fn.apply $dom, args
          $dom
        _trace type, name, 'registered'
      else
        _trace.err type, name, 'is duplicate'
      return

    ### 註冊 controller ###
    self.regCtrl = caro.partial(reg, 'ctrl')
    ### 註冊 module ###
    self.regModule = caro.partial(reg, 'module')

  ### config 相關 ###
  do(self, window, caro) ->
    _cfg = self.$$config
    ### 比對符合的網址, 並 assign config ###
    self.regDifCfg = (url, cfg) ->
      nowUrlPath = self.nowUrlPath
      info = ifUrlPathMustMatchAndGetUrl(url)
      isUrlMustMatch = info.isUrlMustMatch
      url = info.urlPath
      if isUrlMustMatch
        ### 需要完全符合才可 assign config ###
        return if nowUrlPath isnt url
      else
        ### 需要現在的路徑是在 url 以下, 才可 assign config ###
        return if nowUrlPath.indexOf(url) isnt 0
      caro.forEach(cfg, (subCfg, subCfgKey) ->
        _cfg[subCfgKey] = caro.assign(_cfg[subCfgKey], subCfg)
      )
      return
    ### 設置或讀取 config ###
    self.config = (key, val) ->
      return _cfg[key] = val if typeof val isnt 'undefined'
      _cfg[key]
    return

  $(->
    config = self.config('cf')
    isLocalTest = config.isLocalTest
    nowUrlPath = self.nowUrlPath
    self.$body = $('body')
    self.isLocal = do ->
      localUrlPath = config.localUrlPath
      info = ifUrlPathMustMatchAndGetUrl(localUrlPath)
      isUrlMustMatch = info.isUrlMustMatch
      localUrlPath = info.urlPath
      ### 只要完全符合就可判定為 location ###
      return true if nowUrlPath is localUrlPath
      ### 只要現在的路徑是在 localUrlPath 以下, 就可判定為 production ###
      return true if !isUrlMustMatch and nowUrlPath.indexOf(localUrlPath) is 0
      false
    self.isLocalTest = self.isLocal and isLocalTest
    self.isProd = do ->
      prodUrlPath = config.prodUrlPath
      info = ifUrlPathMustMatchAndGetUrl(prodUrlPath)
      isUrlMustMatch = info.isUrlMustMatch
      prodUrlPath = info.urlPath
      ### 只要完全符合就可判定為 production ###
      return true if nowUrlPath is prodUrlPath
      ### 只要現在的路徑是在 prodUrlPath 以下, 就可判定為 production ###
      return true if !isUrlMustMatch and nowUrlPath.indexOf(prodUrlPath) is 0
      false

    caro.forEach _docReady, (docReadyObj) ->
      caro.forEach docReadyObj, (docReadyFn) ->
        docReadyFn and docReadyFn(self)
      return
  )

  window.cf = self
  return