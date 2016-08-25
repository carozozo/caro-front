
/*
CaroFront 核心程式
 */
(function(window, $, caro, MobileDetect) {
  var _ctrl, _docReady, _module, _trace, genTraceFn, ifUrlPathMustMatchAndGetUrl, self;
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

  /* 是否為 localhost */
  self.isLocal = false;

  /* 是否為 local test 模式(由 config 設定) */
  self.isLocalTest = false;

  /* 用來判定目前所在的網址是否為 production */
  self.isProd = false;

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

  /* 所在網址, 不包含 protocol, hash 和 search */
  self.nowUrlPath = (function(location) {
    return location.host + location.pathname;
  })(location);

  /* 所在網址, 不包含 hash 和 search */
  self.nowUrl = (function(location) {
    return location.protocol + '//' + self.nowUrlPath;
  })(location);

  /* 儲存 document ready 後要觸發的 fns, 裡面的 key 為執行順序 */
  _docReady = {
    50: []
  };

  /* 儲存註冊的 controller fns */
  _ctrl = {};

  /* 儲存註冊的 module fns */
  _module = {};

  /*
  判斷 urlPath 是否需要完全符合, 並轉換 urlPath 為一般格式
  e.g. www.com.tw => isMustAllMatch = true, urlPath = 'www.com.tw/'
  e.g. www.com.tw* => isMustAllMatch = undefined, urlPath = 'www.com.tw/'
   */
  ifUrlPathMustMatchAndGetUrl = function(urlPath) {
    var indexOfStart, isMustAllMatch, lastIndex, urlLength;
    indexOfStart = urlPath.lastIndexOf('*');
    urlLength = urlPath.length;
    lastIndex = urlLength - 1;
    if (indexOfStart === lastIndex) {

      /* 如果 url 最後是* => 網址不需要完全符合 */
      isMustAllMatch = true;
      urlPath = urlPath.substring(0, lastIndex);
    }
    urlPath = caro.addTail(urlPath, '/');
    return {
      isMustAllMatch: isMustAllMatch,
      urlPath: urlPath
    };
  };
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
      if (!_docReady[index]) {
        _docReady[index] = [];
      }
      _docReady[index].push(fn);
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
      var _html, typeObj;
      if (!fn) {
        return _trace.err(type, name, 'without function');
      }
      typeObj = type === 'ctrl' ? _ctrl : _module;
      _html = null;
      if (!typeObj[name] && !$.fn[name]) {
        typeObj[name] = $.fn[name] = function() {
          var $dom, args;
          $dom = this;
          args = arguments;
          $dom.cf = self;
          if (page && !_html) {
            $.ajax(page).success(function(html) {
              _html = html;
              $dom.html(_html);
              $dom = fn.apply($dom, args);
            }).error(function() {
              _trace.err('Can not get' + type + 'page:', page);
            });
          } else {
            if (_html) {
              $dom.html(_html);
            }
            $dom = fn.apply($dom, args);
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
    var _cfg;
    _cfg = self.$$config;

    /* 比對符合的網址, 並 assign config */
    self.regDifCfg = function(url, cfg) {
      var info, isUrlMustMatch, nowUrlPath;
      nowUrlPath = self.nowUrlPath;
      info = ifUrlPathMustMatchAndGetUrl(url);
      isUrlMustMatch = info.isUrlMustMatch;
      url = info.urlPath;
      if (isUrlMustMatch) {

        /* 需要完全符合才可 assign config */
        if (nowUrlPath !== url) {
          return;
        }
      } else {

        /* 需要現在的路徑是在 url 以下, 才可 assign config */
        if (nowUrlPath.indexOf(url) !== 0) {
          return;
        }
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
    var ieVer, md;
    md = new MobileDetect(window.navigator.userAgent);
    ieVer = md.version('IE');
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
    var config, isLocalTest, nowUrlPath;
    config = self.config('cf');
    isLocalTest = config.isLocalTest;
    nowUrlPath = self.nowUrlPath;
    self.$body = $('body');
    self.isLocal = (function() {
      var info, isUrlMustMatch, localUrlPath;
      localUrlPath = config.localUrlPath;
      info = ifUrlPathMustMatchAndGetUrl(localUrlPath);
      isUrlMustMatch = info.isUrlMustMatch;
      localUrlPath = info.urlPath;

      /* 只要完全符合就可判定為 location */
      if (nowUrlPath === localUrlPath) {
        return true;
      }

      /* 只要現在的路徑是在 localUrlPath 以下, 就可判定為 production */
      if (!isUrlMustMatch && nowUrlPath.indexOf(localUrlPath) === 0) {
        return true;
      }
      return false;
    })();
    self.isLocalTest = self.isLocal && isLocalTest;
    self.isProd = (function() {
      var info, isUrlMustMatch, prodUrlPath;
      prodUrlPath = config.prodUrlPath;
      info = ifUrlPathMustMatchAndGetUrl(prodUrlPath);
      isUrlMustMatch = info.isUrlMustMatch;
      prodUrlPath = info.urlPath;

      /* 只要完全符合就可判定為 production */
      if (nowUrlPath === prodUrlPath) {
        return true;
      }

      /* 只要現在的路徑是在 prodUrlPath 以下, 就可判定為 production */
      if (!isUrlMustMatch && nowUrlPath.indexOf(prodUrlPath) === 0) {
        return true;
      }
      return false;
    })();
    return caro.forEach(_docReady, function(docReadyObj) {
      caro.forEach(docReadyObj, function(docReadyFn) {
        return docReadyFn && docReadyFn(self);
      });
    });
  });
  window.cf = self;
})(window, $, caro, MobileDetect);
