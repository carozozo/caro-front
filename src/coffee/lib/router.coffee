### 頁面跳轉程式 ###
cf.regLib 'router', (cf) ->
  self = {}
  ### 當下頁面的 DOm ###
  self.$page = null
  ### 紀錄, 載入頁面前要執行的 fns ###
  self._prePage = {}
  ### 紀錄, 載入頁面時要執行的對應 fn ###
  self._page = {}
  ### 紀錄, 載入頁面後要執行的 fns ###
  self._aftPage = {}
  ### 當下頁面名稱 ###
  self.pageName = ''
  ### 換頁程式 ###
  self.transitionFn = null

  $ = cf.require('$')
  caro = cf.require('caro')
  window = cf.require('window')
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
    self.regPage = (name, cb) ->
      pageObj = self._page
      if !pageObj[name]
        pageObj[name] = cb
        _trace 'Page', name, ' registered'
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
      $.ajax('template/' + htmlName).success((html) ->
        return self.goPage() unless html
        $page = $('<div/>').addClass('cf-page').css(
          width: '100%'
          height: '100%'
        )
        self.pageName = pageName

        doPageFn = (pageObj) ->
          caro.forEach pageObj, (fns) ->
            caro.forEach fns, (fn) ->
              fn and fn(self)
              return
            return
          return

        doneFn = ->
          self.$page and self.$page.remove()
          $page.html(html).appendTo(cf.$body).show()
          pageFn = self._page[pageName]
          pageFn and pageFn(cf, $page)
          self.$page = $page
          doPageFn(self._aftPage)
          bindHashChange()
          return

        doPageFn(self._prePage)

        if self.transitionFn
          self.transitionFn(cf, self.$page, $page, doneFn)
        else
          doneFn()
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

cf.regDocReady(->
  cf.router.goPage()
, 100)