
/* 頁面跳轉程式 */
cf.regLib('router', function(cf) {
  var $, _$container, _cfg, _isGoPage, _trace, caro, self, window;
  self = {};

  /* 當下頁面的 Dom */
  self.$page = null;

  /* 儲存載入頁面前要執行的 fns, 裡面的 key 為執行順序 */
  self._prePage = {
    50: []
  };

  /* 儲存載入頁面時要執行的對應 fn */
  self._page = {};

  /* 儲存載入頁面後要執行的 fns, 裡面的 key 為執行順序 */
  self._aftPage = {
    50: []
  };

  /* 當下頁面名稱 */
  self.pageName = '';

  /* 換頁程式 */
  self.transitionFn = null;
  $ = cf.require('$');
  caro = cf.require('caro');
  window = cf.require('window');
  _cfg = cf.config('router');
  _$container = cf.$body;
  _isGoPage = true;
  _trace = cf.genTraceFn('router');

  /* 註冊 page 載入完成後 callback */
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

    /* 註冊 [當 Router 載入頁面前] 要執行的 function */
    self.regPrePage = caro.partial(regPageCb, 'prePage');

    /* 註冊 [當 Router 載入頁面後] 要執行的 function */
    self.regAftPage = caro.partial(regPageCb, 'aftPage');

    /* 註冊 [當 Router 載入頁面後] 要執行的對應 function */
    self.regPage = function(name, cb) {
      var pageObj;
      pageObj = self._page;
      if (!pageObj[name]) {
        pageObj[name] = cb;
        _trace('Page', name, ' registered');
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

    /* 從 hash 取得目前頁面名稱 */
    self.getPageByHash = function(hash) {
      if (hash) {
        return parseUrlHashToObj(hash).page;
      }
      return parseUrlHashToObj(location.hash).page;
    };

    /* 從 hash 取得 search param */
    self.getSearchByHash = function(hash) {
      if (hash) {
        return parseUrlHashToObj(hash).search;
      }
      return parseUrlHashToObj(location.hash).search;
    };

    /* 從 hash 取得 search param 並轉換成物件 */
    self.parseUrlSearch = function(hash) {
      var search;
      search = self.getSearchByHash(hash);
      return parseSearchToObj(search);
    };
  })(caro, window);

  /* 頁面載入相關 */
  (function(cf, self, window, $) {
    var bindHashChange, getBodyContent, unbindHashChange;
    bindHashChange = function() {
      window.onhashchange = function() {

        /* 當 window 監聽到 url hash 值改變時, 跳轉頁面 */
        self.goPage();
      };
    };
    unbindHashChange = function() {

      /* 不要讓 window 監聽 hash 值改變 */
      window.onhashchange = null;
    };
    getBodyContent = function(pageName) {
      var htmlName;
      htmlName = caro.addTail(pageName, '.html');
      $.ajax('template/' + htmlName).success(function(html) {
        var $page, doPageFn, doneFn;
        if (!html) {
          return self.goPage();
        }
        $page = $('<div/>').addClass('cf-page').css({
          width: '100%',
          height: '100%'
        });
        self.pageName = pageName;
        doPageFn = function(pageObj) {
          caro.forEach(pageObj, function(fns) {
            caro.forEach(fns, function(fn) {
              fn && fn(self);
            });
          });
        };
        doneFn = function() {
          var $container, pageFn;
          $container = _cfg.container ? $('#' + _cfg.container) || _$container : void 0;
          self.$page && self.$page.remove();
          $page.html(html).appendTo($container).show();
          pageFn = self._page[pageName];
          pageFn && pageFn(cf, $page);
          self.$page = $page;
          doPageFn(self._aftPage);
          bindHashChange();
        };
        doPageFn(self._prePage);
        if (self.transitionFn) {
          self.transitionFn(cf, self.$page, $page, doneFn);
        } else {
          doneFn();
        }
      }).error(function() {
        self.goPage('index');
      });
    };

    /* 換頁, 不指定頁面時會依 url hash 判斷 */
    self.goPage = function(hashName) {
      var pageName, search;
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
      unbindHashChange();
      window.location.hash = pageName + search;
      getBodyContent(pageName);
    };

    /* 阻止換頁, 執行後, router.goPage 不會被觸發 */
    self.blockGoPage = function() {
      return _isGoPage = false;
    };

    /* 允許換頁, 執行後, router.goPage 可以被觸發 */
    self.approveGoPage = function() {
      return _isGoPage = true;
    };
  })(cf, self, window, $);
  return self;
});

cf.regDocReady(function() {
  return cf.router.goPage();
}, 100);
