
/*
分頁函式庫, 利用 url hash 判斷, 並使用 $.ajax 切換頁面
 */
cf.regLib('router', function(cf) {
  var $, _cfg, _errPageArr, _isGoPage, _trace, caro, self;
  $ = cf.require('$');
  caro = cf.require('caro');
  _cfg = cf.config('router');

  /* 是否允許 goPage */
  _isGoPage = true;

  /* 紀錄 goPage 時發生 error 的 pageName */
  _errPageArr = [];
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
  self.templateExtname = _cfg.templateExtname ? caro.addHead(_cfg.templateExtname, '.') : '';

  /* 註冊 page 載入前後的 callback */
  (function(self) {
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
      return self;
    };

    /* 註冊 [當 Router 準備換頁前] 要執行的 function */
    self.regBefPage = function(fn, index) {
      return regPageCb('befPage', fn, index);
    };

    /* 註冊 [當 Router 載入分頁前] 要執行的 function */
    self.regPrePage = function(fn, index) {
      return regPageCb('prePage', fn, index);
    };

    /* 註冊 [當 Router 載入分頁後] 要執行的 function */
    self.regAftPage = function(fn, index) {
      return regPageCb('aftPage', fn, index);
    };

    /* 註冊 [當 Router 載入分頁後] 要執行的對應 function */
    self.regPage = function(pageName, fn) {
      var pageMap;
      pageMap = self._page;
      if (!pageMap[pageName]) {
        pageMap[pageName] = {};
        pageMap[pageName].fn = fn;
        _trace('Page', pageName, 'registered');
      }
      return self;
    };
  })(self);

  /*
  自定義 url 規則
  e.g. http://www.sample.com.tw/#index?redirect=1 => {hash: 'index', search: 'redirect: 1'}
   */
  (function(cf) {
    var location, parseSearchToObj, parseUrlHashToObj;
    location = cf.require('location');
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
  })(cf);

  /* 分頁載入相關 */
  (function(cf, self, $) {
    var doPageFns, setPageContent;
    doPageFns = function(pageObj, $page) {
      caro.forEach(pageObj, function(fns) {
        caro.forEach(fns, function(fn) {
          fn && fn.call($page, cf);
        });
      });
    };
    setPageContent = function(pageName, opt) {
      var errCb, fileType, go, jqxhr, pageFile, pageMap, sucCb;
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
          cf.$window.off();
          cf.$document.off();
          cf.$body.off();
          html = pageMap[pageName].html;
          pageFn = pageMap[pageName].fn;
          $page.html(html).appendTo(self.$container);
          self.$page = $page;
          self.pageName = pageName;
          doPageFns(self._prePage, $page);
          pageFn && pageFn.call($page, cf);
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
        sucCb = function(html) {
          if (!pageMap[pageName]) {
            pageMap[pageName] = {};
          }
          pageMap[pageName].html = html;
          go();
        };
        errCb = function() {
          _errPageArr.push(pageName);

          /* 嘗試換頁到 index */
          if (pageName !== 'index') {
            return self.goPage('index');
          }
          caro.forEach(pageMap, function(val, pageName) {

            /* 嘗試換頁到第一個註冊的分頁 */
            if (_errPageArr.indexOf(pageName) < 0) {
              self.goPage(pageName);
              return false;
            }
          });
        };
        jqxhr = $.ajax(self.templateDir + pageFile);

        /* jQuery 3.0 之後使用 done/fail 取代 success/error */
        if (jqxhr.done) {
          jqxhr.done(sucCb).fail(errCb);
        } else {
          jqxhr.success(sucCb).error(errCb);
        }
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
      cf.require('location').hash = pageName + search;
      setPageContent(pageName, opt);
      return self;
    };

    /* 阻止換頁, 執行後, router.goPage 不會被觸發 */
    self.blockGoPage = function() {
      _isGoPage = false;
      return self;
    };

    /* 允許換頁, 執行後, router.goPage 可以被觸發 */
    self.approveGoPage = function() {
      _isGoPage = true;
      return self;
    };
  })(cf, self, $);
  return self;
});

cf.regDocReady(function() {
  cf.router.goPage();
}, 100);
