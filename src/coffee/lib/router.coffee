### 頁面跳轉程式 ###
cf.regLib 'router', (cf) ->
  self = {}
  ### 當下頁面的容器 ###
  self.$container = null
  ### 當下頁面的 Dom ###
  self.$page = null
  ### 儲存載入頁面前要執行的 fns, 裡面的 key 為執行順序 ###
  self._prePage = {
    50: []
  }
  ### 儲存載入頁面時要執行的對應 fn ###
  self._page = {}
  ### 儲存載入頁面後要執行的 fns, 裡面的 key 為執行順序 ###
  self._aftPage = {
    50: []
  }
  ### 當下頁面名稱 ###
  self.pageName = ''
  ### 換頁程式 ###
  self.transitionFn = null

  $ = cf.require('$')
  caro = cf.require('caro')
  window = cf.require('window')
  _cfg = cf.config('router')
  _isGoPage = true
  _trace = cf.genTraceFn('router')
  #  _trace.startTrace();

  ### 註冊 page 載入完成後 callback ###
  do(self, caro) ->
    regPageCb = (type, fn, index = 50) ->
      pageObj = self['_' + type]
      pageObj[index] = [] unless pageObj[index]
      pageObj[index].push(fn)
      return

    ### 註冊 [當 Router 載入頁面前] 要執行的 function ###
    self.regPrePage = caro.partial(regPageCb, 'prePage')
    ### 註冊 [當 Router 載入頁面後] 要執行的 function ###
    self.regAftPage = caro.partial(regPageCb, 'aftPage')
    ### 註冊 [當 Router 載入頁面後] 要執行的對應 function ###
    self.regPage = (pageName, fn) ->
      pageMap = self._page
      unless pageMap[pageName]
        pageMap[pageName] = {}
        pageMap[pageName].fn = fn
        _trace 'Page', pageName, ' registered'
      return
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
    self.getPageByHash = (hash = location.hash) ->
      parseUrlHashToObj(hash).page

    ### 從 hash 取得 search param ###
    self.getSearchByHash = (hash = location.hash) ->
      parseUrlHashToObj(hash).search

    ### 從 hash 取得 search param 並轉換成物件 ###
    self.parseUrlSearch = (hash) ->
      search = self.getSearchByHash(hash)
      parseSearchToObj search

    return

  ### 頁面載入相關 ###
  do(cf, self, window, $) ->
    doPageFns = (pageObj) ->
      caro.forEach pageObj, (fns) ->
        caro.forEach fns, (fn) ->
          fn and fn(self)
          return
        return
      return

    setPageContent = (pageName) ->
      pageMap = self._page
      go = ->
        $nowPage = self.$page
        self.$container = if _cfg.container then $('#' + _cfg.container) else cf.$body
        $page = $('<div/>').addClass('cf-page').css(
          width: '100%'
          height: '100%'
        )
        setPage = ->
          html = pageMap[pageName].html
          pageFn = pageMap[pageName].fn
          $page.html(html).appendTo(self.$container)
          self.$page = $page
          self.pageName = pageName
          pageFn and pageFn(cf, $page)
          doPageFns(self._aftPage)
          return
        doneFn = ->
          $nowPage and $nowPage.remove()
          return

        if $nowPage and self.transitionFn
          setPage()
          self.transitionFn(cf, $nowPage, $page, doneFn)
        else
          setPage()
          doneFn()
        return

      unless pageMap[pageName] and pageMap[pageName].html
        htmlName = caro.addTail(pageName, '.html')
        $.ajax('template/' + htmlName).success((html) ->
          pageMap[pageName] = {} unless pageMap[pageName]
          pageMap[pageName].html = html
          go()
          return
        ).error(->
          ### 嘗試換頁到 index ###
          indexInfo = caro.find(pageMap, (val, pageName) ->
            return pageName is 'index'
          )
          return self.goPage('index') if indexInfo
          ### 嘗試換頁到第一個註冊的頁面 ###
          pageNameArr = caro.keys(pageMap)
          firstPage = pageNameArr[0]
          self.goPage(firstPage) if firstPage
          return
        )
        return
      go()
      return

    ### 換頁, 不指定頁面時會依 url hash 判斷 ###
    self.goPage = (hashName) ->
      doPageFns(self._prePage)
      pageName = self.getPageByHash(hashName) or 'index'
      search = self.getSearchByHash(hashName)
      search = '?' + search if search
      unless _isGoPage
        _trace 'Block goPage:', pageName
        return
      _trace 'Start goPage:', pageName
      window.location.hash = pageName + search
      setPageContent pageName
      return

    ### 阻止換頁, 執行後, router.goPage 不會被觸發 ###
    self.blockGoPage = ->
      _isGoPage = false
      return

    ### 允許換頁, 執行後, router.goPage 可以被觸發 ###
    self.approveGoPage = ->
      _isGoPage = true
      return

    return

  self

cf.regDocReady(->
  cf.router.goPage()
, 100)