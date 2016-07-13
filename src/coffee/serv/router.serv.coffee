### 頁面跳轉程式 ###
cf.regServ 'router', (cf) ->
  self =
    $page: null
    _prePage: {}
    _page: {}
    _aftPage: {}
    pageName: ''
    indexUrl: ''
    transitionFn: null
  $ = cf.require('$')
  caro = cf.require('caro')
  window = cf.require('window')
  _isGoPage = true
  _trace = cf.genTraceFn('router')
  #  _trace.startTrace();

  ### 註冊 page 載入完成後 callback ###
  do(self, caro) ->
    regPageCb = (type, name, cb) ->
      pageObj = self['_' + type]
      if !pageObj[name]
        pageObj[name] = cb
        _trace type, name, ' registered'
      return
    self.regPrePage = caro.partial(regPageCb, 'prePage') # 註冊 [當 Router 載入頁面前] 要執行的 function
    self.regAftPage = caro.partial(regPageCb, 'aftPage') # 註冊 [當 Router 載入頁面後] 要執行的 function
    self.regPage = caro.partial(regPageCb, 'page')
    return

  ###
  自定義 url 規則
  e.g. http://www.sample.com.tw/#index?redirect=1 => {hash: 'index', search: 'redirect: 1'}
  ###
  do(caro, window) ->
    location = window.location
    parseUrlHashToObj = (hash) ->
      obj =
        page: ''
        search: ''
      return obj unless hash
      hash = hash.replace('#', '')
      hashArr = hash.split('?')
      obj.page = hashArr[0] or ''
      obj.search = hashArr[1] or ''
      obj

    ### e.g. http://www.sample.com.tw/#index?page=1&vote=2 => {page:1, vote:2} ###
    parseSearchToObj = (search) ->
      return null unless search
      obj = {}
      searchArr = search.split('&')
      caro.reduce searchArr, ((result, param) ->
        paramArr = param.split('=')
        key = paramArr[0]
        val = paramArr[1]
        return unless key
        result[key] = val
        result
      ), obj
      obj

    ### 從 hash 取得目前頁面名稱 ###
    self.getPageByHash = (hash) ->
      return parseUrlHashToObj(hash).page if hash
      parseUrlHashToObj(location.hash).page

    ### 從 hash 取得 search param ###
    self.getSearchByHash = (hash) ->
      return parseUrlHashToObj(hash).search if hash
      parseUrlHashToObj(location.hash).search

    ### 從 hash 取得 search param 並轉換成物件 ###
    self.parseUrlSearch = (hash) ->
      search = self.getSearchByHash(hash)
      parseSearchToObj search

    ### 首頁網址 ###
    self.indexUrl = do ->
      pathnameArr = location.pathname.split('/')
      pathnameArr.pop()
      location.protocol + '//' + location.host + caro.addTail(pathnameArr.join('/'), '/')

    return

  ### 頁面載入相關 ###
  do(cf, self, window, $) ->
    bindHashChange = ->
      window.onhashchange = ->
        ### 當 window 監聽到 url hash 值改變時, 跳轉頁面 ###
        self.goPage()
        return
      return

    unbindHashChange = ->
      ### 不要讓 window 監聽 hash 值改變 ###
      window.onhashchange = null
      return

    getBodyContent = (pageName) ->
      htmlName = caro.addTail(pageName, '.html')
      $page = $('<div/>').addClass('cf-page').css(
        width: '100%'
        height: '100%'
      )
      $.ajax('template/' + htmlName).success((html) ->
        if !html
          return self.goPage()
        _trace 'Got body'
        pageFn = self._page[pageName]
        self.pageName = pageName

        doneFn = ->
          self.$page and self.$page.remove()
          $page.html(html).appendTo(cf.$body).show()
          pageFn and pageFn(cf, $page)
          self.$page = $page

        caro.forEach self._prePage, (fn) ->
          fn and fn(cf)
          return

        if self.transitionFn
          self.transitionFn(cf, self.$page, $page, doneFn)
        else
          doneFn()

        caro.forEach self._aftPage, (fn) ->
          fn and fn(cf)
          return
        bindHashChange()
        return
      ).error ->
        self.goPage('index')
        return
      return

    ### 換頁, 不指定頁面時會依 url hash 判斷 ###
    self.goPage = (hashName) ->
      pageName = self.getPageByHash(hashName) or 'index'
      search = self.getSearchByHash(hashName)
      search = '?' + search if search
      unless _isGoPage
        _trace 'Block goPage:', pageName
        return
      _trace 'Start goPage:', pageName
      unbindHashChange()
      window.location.hash = pageName + search
      getBodyContent pageName
      return

    ### 阻止換頁, 執行後, router.goPage 不會被觸發 ###
    self.blockGoPage = ->
      _isGoPage = false

    ### 允許換頁, 執行後, router.goPage 可以被觸發 ###
    self.approveGoPage = ->
      _isGoPage = true

    return

  self

cf.regDocReady 'router', ->
  cf.router.goPage()
, 100