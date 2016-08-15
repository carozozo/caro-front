
/* 分頁跳轉程式 */
cf.regLib('router', function(cf) {
  var $, _cfg, _isGoPage, _trace, caro, self, window;
  $ = cf.require('$');
  caro = cf.require('caro');
  window = cf.require('window');
  _cfg = cf.config('router');
  _isGoPage = true;
  _trace = cf.genTraceFn('router');
  self = {};

  /* 當下分頁的容器 */
  self.$container = null;

  /* 當下分頁的 Dom */
  self.$page = null;

  /* 儲存每次執行 cf.goPage 前要執行的 fns, 裡面的 key 為執行順序 */
  self._befPage = {
    50: []
  };

  /* 儲存載入分頁前要執行的 fns, 裡面的 key 為執行順序 */
  self._prePage = {
    50: []
  };

  /* 儲存載入分頁後要執行的對應 fn */
  self._page = {};

  /* 儲存載入分頁後要執行的 fns, 裡面的 key 為執行順序 */
  self._aftPage = {
    50: []
  };

  /* 換頁效果程式 */
  self._transitionFn = null;

  /* 當下分頁名稱 */
  self.pageName = '';

  /* 記錄要放置分頁的資料夾路徑 */
  self.templateDir = caro.addTail(_cfg.templateDir || '', '/');

  /* 記錄要載入的分頁副檔名 */
  self.templateExtname = caro.addHead(_cfg.templateExtname || 'html', '.');

  /* 註冊 page 載入前後的 callback */
  (function(self, caro) {
    var regPageCb;
    regPageCb = function(type, fn, index) {
      var pageObj;
      if (index == null) {
        index = 50;
      }
      pageObj = self['_' + type];
      if (!pageObj[index]) {
        pageObj[index] = [];
      }
      pageObj[index].push(fn);
    };

    /* 註冊 [當 Router 準備換頁前] 要執行的 function */
    self.regBefPage = caro.partial(regPageCb, 'befPage');

    /* 註冊 [當 Router 載入分頁前] 要執行的 function */
    self.regPrePage = caro.partial(regPageCb, 'prePage');

    /* 註冊 [當 Router 載入分頁後] 要執行的 function */
    self.regAftPage = caro.partial(regPageCb, 'aftPage');

    /* 註冊 [當 Router 載入分頁後] 要執行的對應 function */
    self.regPage = function(pageName, fn) {
      var pageMap;
      pageMap = self._page;
      if (!pageMap[pageName]) {
        pageMap[pageName] = {};
        pageMap[pageName].fn = fn;
        _trace('Page', pageName, ' registered');
      }
    };
  })(self, caro);

  /*
  自定義 url 規則
  e.g. http://www.sample.com.tw/#index?redirect=1 => {hash: 'index', search: 'redirect: 1'}
   */
  (function(caro, window) {
    var location, parseSearchToObj, parseUrlHashToObj;
    location = window.location;
    parseUrlHashToObj = function(hash) {
      var hashArr, obj;
      obj = {
        page: '',
        search: ''
      };
      if (!hash) {
        return obj;
      }
      hash = hash.replace('#', '');
      hashArr = hash.split('?');
      obj.page = hashArr[0] || '';
      obj.search = hashArr[1] || '';
      return obj;
    };

    /* e.g. http://www.sample.com.tw/#index?page=1&vote=2 => {page:1, vote:2} */
    parseSearchToObj = function(search) {
      var obj, searchArr;
      if (!search) {
        return null;
      }
      obj = {};
      searchArr = search.split('&');
      caro.reduce(searchArr, (function(result, param) {
        var key, paramArr, val;
        paramArr = param.split('=');
        key = paramArr[0];
        val = paramArr[1];
        if (!key) {
          return;
        }
        result[key] = val;
        return result;
      }), obj);
      return obj;
    };

    /* 從 hash 取得目前分頁名稱 */
    self.getPageByHash = function(hash) {
      if (hash == null) {
        hash = location.hash;
      }
      return parseUrlHashToObj(hash).page;
    };

    /* 從 hash 取得 search param */
    self.getSearchByHash = function(hash) {
      if (hash == null) {
        hash = location.hash;
      }
      return parseUrlHashToObj(hash).search;
    };

    /* 從 hash 取得 search param 並轉換成物件 */
    self.parseUrlSearch = function(hash) {
      var search;
      search = self.getSearchByHash(hash);
      return parseSearchToObj(search);
    };
  })(caro, window);

  /* 分頁載入相關 */
  (function(cf, self, window, $) {
    var doPageFns, setPageContent;
    doPageFns = function(pageObj, $page) {
      caro.forEach(pageObj, function(fns) {
        caro.forEach(fns, function(fn) {
          fn && fn(cf, $page);
        });
      });
    };
    setPageContent = function(pageName, opt) {
      var fileType, go, pageFile, pageMap;
      if (opt == null) {
        opt = {};
      }
      pageMap = self._page;
      go = function() {
        var $nowPage, $page, doneFn, setPage;
        $nowPage = self.$page;
        self.$container = _cfg.container ? $('#' + _cfg.container) : cf.$body;
        $page = $('<div/>').addClass('cf-page').css({
          width: '100%',
          height: '100%'
        });
        setPage = function() {
          var html, pageFn;
          html = pageMap[pageName].html;
          pageFn = pageMap[pageName].fn;
          $page.html(html).appendTo(self.$container);
          self.$page = $page;
          self.pageName = pageName;
          doPageFns(self._prePage, $page);
          pageFn && pageFn(cf, $page);
          doPageFns(self._aftPage, $page);
        };
        doneFn = function() {
          $nowPage && $nowPage.remove();
        };
        if ($nowPage && self._transitionFn) {
          setPage();
          self._transitionFn(cf, $nowPage, $page, doneFn);
        } else {
          setPage();
          doneFn();
        }
      };
      if (!(pageMap[pageName] && pageMap[pageName].html)) {
        fileType = opt.fileType || self.templateExtname;
        pageFile = caro.addTail(pageName, fileType);
        $.ajax(self.templateDir + pageFile).success(function(html) {
          if (!pageMap[pageName]) {
            pageMap[pageName] = {};
          }
          pageMap[pageName].html = html;
          go();
        }).error(function() {

          /* 嘗試換頁到 index */
          var firstPage, indexInfo, pageNameArr;
          indexInfo = caro.find(pageMap, function(val, pageName) {
            return pageName === 'index';
          });
          if (indexInfo) {
            return self.goPage('index');
          }

          /* 嘗試換頁到第一個註冊的分頁 */
          pageNameArr = caro.keys(pageMap);
          firstPage = pageNameArr[0];
          if (firstPage) {
            self.goPage(firstPage);
          }
        });
        return;
      }
      go();
    };

    /* 換頁, 不指定分頁時會依 url hash 判斷 */
    self.goPage = function(hashName, opt) {
      var pageName, search;
      doPageFns(self._befPage);
      pageName = self.getPageByHash(hashName) || 'index';
      search = self.getSearchByHash(hashName);
      if (search) {
        search = '?' + search;
      }
      if (!_isGoPage) {
        _trace('Block goPage:', pageName);
        return;
      }
      _trace('Start goPage:', pageName);
      window.location.hash = pageName + search;
      setPageContent(pageName, opt);
    };

    /* 阻止換頁, 執行後, router.goPage 不會被觸發 */
    self.blockGoPage = function() {
      _isGoPage = false;
    };

    /* 允許換頁, 執行後, router.goPage 可以被觸發 */
    self.approveGoPage = function() {
      _isGoPage = true;
    };
  })(cf, self, window, $);
  return self;
});

cf.regDocReady(function() {
  return cf.router.goPage();
}, 100);
