### CaroFront 核心程式 ###
do(window, $, caro, MobileDetect) ->
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
  ### 當前網址是否為 https  ###
  self.isHttps = false
  ### 當前載具是否為手機 ###
  self.isPhone = false
  ### 當前載具是否為平板 ###
  self.isTablet = false
  ### 當前載具是否為手機 or 平板  ###
  self.isMobile = false
  ### IE 版本, 瀏覽器不是 IE 時會是 null ###
  self.ieVersion = false
  ### 瀏覽器是否為 IE8 之前的版本  ###
  self.isBefIe8 = false
  ### 瀏覽器是否為 IE9 之前的版本   ###
  self.isBefIe9 = false
  ### 所在網址, 不包含 hash 和 search ###
  self.nowUrl = do(window) ->
    location = window.location
    location.protocol + '//' + location.host + location.pathname

  ### 儲存 document ready 後要觸發的 fns, 裡面的 key 為執行順序 ###
  _docReady = {
    50: []
  }
  ### 儲存註冊的 controller fns ###
  _ctrl = {}
  ### 儲存註冊的 module fns ###
  _module = {}

  genTraceFn = (name) ->
    fn = ->
      return if !fn.traceMode or self.isBefIe9
      name = caro.upperFirst(name)
      args = caro.values(arguments)
      args.unshift name + ':'
      console.log.apply console, args
      return

    fn.err = ->
      return if self.isBefIe9
      name = caro.upperFirst(name)
      args = caro.values(arguments)
      args.unshift name + ':'
      console.error.apply console, args
      return

    fn.startTrace = ->
      fn.traceMode = true
      return
    fn

  _trace = genTraceFn('system')
  #  _trace.startTrace()

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
        if page
          page = 'template/' + page
          page += '.html'
          $.ajax(page).success((html) ->
            _html = html
            return
          ).error(->
            _trace.err 'Can not get' + type + 'page:', page
            return
          )
        typeObj[name] = $.fn[name] = ->
          $dom = this
          args = arguments
          $dom.cf = self
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
    nowUrl = self.nowUrl.replace('https://', '')
    nowUrl = nowUrl.replace('http://', '')
    ### 比對符合的首頁網址, 並 assign config ###
    self.regDifCfg = (url, cfg) ->
      url = caro.addTail(url, '/')
      return if nowUrl isnt url
      caro.forEach(cfg, (subCfg, subCfgKey) ->
        _cfg[subCfgKey] = caro.assign(_cfg[subCfgKey], subCfg)
      )
      return
    ### 設置或讀取 config ###
    self.config = (key, val) ->
      return _cfg[key] = val if typeof val isnt 'undefined'
      _cfg[key]
    return

  ### 設定相關 ###
  do(window) ->
    md = new MobileDetect(window.navigator.userAgent)
    ieVer = md.version('IE')
    location = window.location
    self.isLocal = location.hostname is 'localhost'
    self.isHttps = location.protocol.indexOf('https:') is 0
    self.isPhone = md.phone()
    self.isTablet = md.tablet()
    self.isMobile = md.mobile()
    self.ieVersion = ieVer
    self.isBefIe8 = do ->
      ieVer and ieVer < 9
    self.isBefIe9 = do ->
      ieVer and ieVer < 10
    return

  $(->
    self.$body = $('body')
    self.isLocalTest = self.isLocal and self.config('cf').isLocalTest
    caro.forEach _docReady, (docReadyObj) ->
      caro.forEach docReadyObj, (docReadyFn) ->
        docReadyFn and docReadyFn(self)
      return
  )

  window.cf = self
  return