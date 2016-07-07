
/* 頁面跳轉程式 */
cf.regLib('router', function(cf) {
  var $, _isGoPage, _trace, caro, self, window;
  self = {
    $page: null,
    _prePage: {},
    _page: {},
    _aftPage: {},
    pageName: '',
    indexUrl: '',
    transitionFn: null
  };
  $ = cf.require('$');
  caro = cf.require('caro');
  window = cf.require('window');
  _isGoPage = true;
  _trace = cf.genTraceFn('router');

  /* 註冊 page 載入完成後 callback */
  (function(self, caro) {
    var regPageCb;
    regPageCb = function(type, name, cb) {
      var pageObj;
      pageObj = self['_' + type];
      if (!pageObj[name]) {
        pageObj[name] = cb;
        _trace(type, name, ' registered');
      }
    };
    self.regPrePage = caro.partial(regPageCb, 'prePage');
    self.regAftPage = caro.partial(regPageCb, 'aftPage');
    self.regPage = caro.partial(regPageCb, 'page');
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
    self.getPageByHash = function(hash) {
      if (hash) {
        return parseUrlHashToObj(hash).page;
      }
      return parseUrlHashToObj(location.hash).page;
    };
    self.getSearchByHash = function(hash) {
      if (hash) {
        return parseUrlHashToObj(hash).search;
      }
      return parseUrlHashToObj(location.hash).search;
    };
    self.parseUrlSearch = function(hash) {
      var search;
      search = self.getSearchByHash(hash);
      return parseSearchToObj(search);
    };
    self.indexUrl = (function() {
      var pathnameArr;
      pathnameArr = location.pathname.split('/');
      pathnameArr.pop();
      return location.protocol + '//' + location.host + caro.addTail(pathnameArr.join('/'), '/');
    })();
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
      var $page, htmlName;
      htmlName = caro.addTail(pageName, '.html');
      $page = $('<div/>').addClass('cf-page').css({
        width: '100%',
        height: '100%'
      });
      $.ajax('template/' + htmlName).success(function(html) {
        var doneFn, pageFn;
        if (!html) {
          return self.goPage();
        }
        _trace('Got body');
        pageFn = self._page[pageName];
        self.pageName = pageName;
        doneFn = function() {
          self.$page && self.$page.remove();
          $page.html(html).appendTo(cf.$body).show();
          pageFn && pageFn(cf, $page);
          return self.$page = $page;
        };
        caro.forEach(self._prePage, function(fn) {
          fn && fn(cf);
        });
        if (self.transitionFn) {
          self.transitionFn(cf, self.$page, $page, doneFn);
        } else {
          doneFn();
        }
        caro.forEach(self._aftPage, function(fn) {
          fn && fn(cf);
        });
        bindHashChange();
      }).error(function() {
        self.goPage('index');
      });
    };
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
    self.blockGoPage = function() {
      return _isGoPage = false;
    };
    self.approveGoPage = function() {
      return _isGoPage = true;
    };
  })(cf, self, window, $);
  return self;
});

cf.regDocReady('router', function() {
  return cf.router.goPage();
});
