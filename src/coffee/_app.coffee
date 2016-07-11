### TheIndex 核心程式 ###
do(window, $, caro, MobileDetect) ->
  self =
    $$config: {}
    $$data: {}
    $window: $(window)
    $document: $(document)
    $body: {}
    $ctrl: {}
    $module: {}
    _docReady: {
      50: {}
    }
    _ctrl: {}
    _module: {}
    isLocal: false
    isLocalTest: false
    isHttps: false
    isPhone: false
    isTablet: false
    isMobile: false
    ieVersion: false
    isBefIe8: false
    isBefIe9: false

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

  do(self, window) ->
    ### 核心程式 ###
    self.require = (name) ->
      window[name]

    self.data = (key, val) ->
      return self.$$data[key] = val if typeof val isnt 'undefined'
      self.$$data[key]

    self.regDocReady = (name, fn, index = 50) ->
      self._docReady[index] = {} unless self._docReady[index]
      _docReady = self._docReady[index]
      if !_docReady[name]
        _docReady[name] = fn
        _trace 'DocReady Fn ', name, ' registered'
      return

    self.genTraceFn = genTraceFn
    return

  do(self) ->
    ### 註冊 caro-front 物件 ###
    regAppObj = (type, name, fn) ->
      if !self[name]
        self[name] = fn self
        _trace type, name, 'registered'
        return
      _trace.err type, name, ' is duplicate'
      return

    ### 註冊 library ###
    self.regServ = caro.partial(regAppObj, 'serv')
    return

  do(self, $) ->
    ### ctrl and module ###
    reg = (type, name, fn, page) ->
      if !fn
        return _trace.err('ctrl', name, 'without function')
      typeObj = if type is 'ctrl' then self._ctrl else self._module
      typeDomObj = if type is 'ctrl' then self.$ctrl else self.$module
      if !typeObj[name] and !$.fn[name]
        if page
          page = 'template/' + page
          page += '.html'
        typeObj[name] = $.fn[name] = ->
          $dom = this
          args = arguments
          $dom.cf = self
          if page
            $.ajax(page).success((html) ->
              $dom.html html
              fn.apply $dom, args
              typeDomObj[name] = $dom
              return
            ).error(->
              _trace.err 'Can not get' + type + 'page:', page
              return
            )
          else
            fn.apply $dom, args
            typeDomObj[name] = $dom
          $dom

        _trace type, name, 'registered'
      else
        _trace.err type, name, 'is duplicate'
      return

    self.regCtrl = caro.partial(reg, 'ctrl')
    self.regModule = caro.partial(reg, 'module')

  do(self, window, caro) ->
    ### config 相關 ###
    _cfg = self.$$config
    self.regDifCfg = (url, cfg) ->
      ### 比對符合的首頁網址, 並 assign config ###
      location = window.location
      indexUrl = location.host + caro.addTail(location.pathname, '/')
      url = caro.addTail(url, '/')
      return if indexUrl isnt url
      caro.forEach(cfg, (subCfg, subCfgKey) ->
        _cfg[subCfgKey] = caro.assign(_cfg[subCfgKey], subCfg)
      )
      return

    self.config = (key, val) ->
      return _cfg[key] = val if typeof val isnt 'undefined'
      _cfg[key]
    return

  do(window) ->
    ### 設定相關 ###
    md = new MobileDetect(window.navigator.userAgent)
    ieVer = md.version('IE')
    location = window.location
    self.isLocal = location.hostname is 'localhost'
    self.isHttps = location.protocol.indexOf('https:') is 0
    ### 手機 ###
    self.isPhone = md.phone()
    ### 平板 ###
    self.isTablet = md.tablet()
    ### 手機 and 平板 ###
    self.isMobile = md.mobile()
    ### IE 版本 ###
    self.ieVersion = ieVer
    self.isBefIe8 = do ->
      ieVer and ieVer < 9
    self.isBefIe9 = do ->
      ieVer and ieVer < 10
    return

  $(->
    self.$body = $('body')
    self.isLocalTest = self.isLocal and self.config('cf').isLocalTest
    caro.forEach self._docReady, (docReadyObj) ->
      caro.forEach docReadyObj, (docReadyFn) ->
        docReadyFn and docReadyFn(self)
      return
  )

  window.cf = self
  return