
/* CaroFront 核心程式 */
(function(window, $, caro, MobileDetect) {
  var _trace, genTraceFn, self;
  self = {};

  /* 儲存從 config 讀取到的設定 */
  self.$$config = {};

  /* 儲存資料, 類似 cookie, 但頁面刷新後會清空 */
  self.$$data = {};

  /* 同 $(window) */
  self.$window = $(window);

  /* 同 $(document) */
  self.$document = $(document);

  /* 同 $('body') */
  self.$body = {};

  /* 儲存呼叫 controller 後產生的 DOM 物件, 依名稱分類 */
  self.$ctrl = {};

  /* 儲存呼叫 module 後產生的 DOM 物件, 依名稱分類 */
  self.$module = {};

  /* 儲存 document ready 後要觸發的 fns, 裡面的 key 為執行順序 */
  self._docReady = {
    50: []
  };

  /* 儲存註冊的 controller fns */
  self._ctrl = {};

  /* 儲存註冊的 module fns */
  self._module = {};

  /* 是否為 localhost */
  self.isLocal = false;

  /* 是否為 local test 模式(由 config 設定) */
  self.isLocalTest = false;

  /* 當前網址是否為 https */
  self.isHttps = false;

  /* 當前載具是否為手機 */
  self.isPhone = false;

  /* 當前載具是否為平板 */
  self.isTablet = false;

  /* 當前載具是否為手機 or 平板 */
  self.isMobile = false;

  /* IE 版本, 瀏覽器不是 IE 時會是 null */
  self.ieVersion = false;

  /* 瀏覽器是否為 IE8 之前的版本 */
  self.isBefIe8 = false;

  /* 瀏覽器是否為 IE9 之前的版本 */
  self.isBefIe9 = false;

  /* 首頁網址 */
  self.indexUrl = (function() {
    var location, pathnameArr;
    location = window.location;
    pathnameArr = location.pathname.split('/');
    pathnameArr.pop();
    return location.protocol + '//' + location.host + caro.addTail(pathnameArr.join('/'), '/');
  })();
  genTraceFn = function(name) {
    var fn;
    fn = function() {
      var args;
      if (!fn.traceMode || self.isBefIe9) {
        return;
      }
      name = caro.upperFirst(name);
      args = caro.values(arguments);
      args.unshift(name + ':');
      console.log.apply(console, args);
    };
    fn.err = function() {
      var args;
      if (self.isBefIe9) {
        return;
      }
      name = caro.upperFirst(name);
      args = caro.values(arguments);
      args.unshift(name + ':');
      console.error.apply(console, args);
    };
    fn.startTrace = function() {
      fn.traceMode = true;
    };
    return fn;
  };
  _trace = genTraceFn('system');

  /* 核心程式 */
  (function(self, window) {

    /* 載入 global 變數, 避免直接呼叫 global 變數以增加效能 */
    self.require = function(name) {
      return window[name];
    };

    /* 寫入或讀取 data, 功能類似 config, 跨檔案存取資料使用 */
    self.data = function(key, val) {
      if (typeof val !== 'undefined') {
        return self.$$data[key] = val;
      }
      return self.$$data[key];
    };

    /* 註冊 document ready 要執行的 cb */
    self.regDocReady = function(fn, index) {
      if (index == null) {
        index = 50;
      }
      if (!self._docReady[index]) {
        self._docReady[index] = [];
      }
      self._docReady[index].push(fn);
    };

    /* 產生 trace 用的 fn, 會在 console 顯示訊息(IE8 之前不支援 console) */
    self.genTraceFn = genTraceFn;
  })(self, window);

  /* 註冊 caro-front 物件 */
  (function(self) {
    var regAppObj;
    regAppObj = function(type, name, fn) {
      if (!self[name]) {
        self[name] = fn(self);
        _trace(type, name, 'registered');
        return;
      }
      _trace.err(type, name, ' is duplicate');
    };

    /* 註冊 library */
    self.regLib = caro.partial(regAppObj, 'lib');

    /* 註冊 service */
    self.regServ = caro.partial(regAppObj, 'serv');
  })(self);

  /* ctrl and module */
  (function(self, $) {
    var reg;
    reg = function(type, name, fn, page) {
      var typeDomObj, typeObj;
      if (!fn) {
        return _trace.err(type, name, 'without function');
      }
      typeObj = type === 'ctrl' ? self._ctrl : self._module;
      typeDomObj = type === 'ctrl' ? self.$ctrl : self.$module;
      if (!typeObj[name] && !$.fn[name]) {
        if (page) {
          page = 'template/' + page;
          page += '.html';
        }
        typeObj[name] = $.fn[name] = function() {
          var $dom, args;
          $dom = this;
          args = arguments;
          $dom.cf = self;
          if (page) {
            $.ajax(page).success(function(html) {
              $dom.html(html);
              fn.apply($dom, args);
              typeDomObj[name] = $dom;
            }).error(function() {
              _trace.err('Can not get' + type + 'page:', page);
            });
          } else {
            fn.apply($dom, args);
            typeDomObj[name] = $dom;
          }
          return $dom;
        };
        _trace(type, name, 'registered');
      } else {
        _trace.err(type, name, 'is duplicate');
      }
    };

    /* 註冊 controller */
    self.regCtrl = caro.partial(reg, 'ctrl');

    /* 註冊 module */
    return self.regModule = caro.partial(reg, 'module');
  })(self, $);

  /* config 相關 */
  (function(self, window, caro) {
    var _cfg, indexUrl;
    _cfg = self.$$config;
    indexUrl = self.indexUrl.replace('https://', '');
    indexUrl = indexUrl.replace('http://', '');

    /* 比對符合的首頁網址, 並 assign config */
    self.regDifCfg = function(url, cfg) {
      url = caro.addTail(url, '/');
      if (indexUrl !== url) {
        return;
      }
      caro.forEach(cfg, function(subCfg, subCfgKey) {
        return _cfg[subCfgKey] = caro.assign(_cfg[subCfgKey], subCfg);
      });
    };

    /* 設置或讀取 config */
    self.config = function(key, val) {
      if (typeof val !== 'undefined') {
        return _cfg[key] = val;
      }
      return _cfg[key];
    };
  })(self, window, caro);

  /* 設定相關 */
  (function(window) {
    var ieVer, location, md;
    md = new MobileDetect(window.navigator.userAgent);
    ieVer = md.version('IE');
    location = window.location;
    self.isLocal = location.hostname === 'localhost';
    self.isHttps = location.protocol.indexOf('https:') === 0;
    self.isPhone = md.phone();
    self.isTablet = md.tablet();
    self.isMobile = md.mobile();
    self.ieVersion = ieVer;
    self.isBefIe8 = (function() {
      return ieVer && ieVer < 9;
    })();
    self.isBefIe9 = (function() {
      return ieVer && ieVer < 10;
    })();
  })(window);
  $(function() {
    self.$body = $('body');
    self.isLocalTest = self.isLocal && self.config('cf').isLocalTest;
    return caro.forEach(self._docReady, function(docReadyObj) {
      caro.forEach(docReadyObj, function(docReadyFn) {
        return docReadyFn && docReadyFn(self);
      });
    });
  });
  window.cf = self;
})(window, $, caro, MobileDetect);
