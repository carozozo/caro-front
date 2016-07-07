
/* TheIndex 核心程式 */
(function(window, $, caro, MobileDetect) {
  var _trace, genTraceFn, self;
  self = {
    $$config: {},
    $$data: {},
    $window: $(window),
    $document: $(document),
    $body: {},
    $ctrl: {},
    $module: {},
    _docReady: {
      50: {}
    },
    _ctrl: {},
    _module: {},
    isLocal: false,
    isLocalTest: false,
    isHttps: false,
    isPhone: false,
    isTablet: false,
    isMobile: false,
    ieVersion: false,
    isBefIe8: false,
    isBefIe9: false
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
  (function(self, window) {

    /* 核心程式 */
    self.require = function(name) {
      return window[name];
    };
    self.data = function(key, val) {
      if (typeof val !== 'undefined') {
        return self.$$data[key] = val;
      }
      return self.$$data[key];
    };
    self.regDocReady = function(name, fn, index) {
      var _docReady;
      if (index == null) {
        index = 50;
      }
      if (!self._docReady[index]) {
        self._docReady[index] = {};
      }
      _docReady = self._docReady[index];
      if (!_docReady[name]) {
        _docReady[name] = fn;
        _trace('DocReady Fn ', name, ' registered');
      }
    };
    self.genTraceFn = genTraceFn;
  })(self, window);
  (function(self) {

    /* 註冊 caro-front 物件 */
    var regTheIndexObj;
    regTheIndexObj = function(type, name, fn) {
      if (!self[name]) {
        self[name] = fn(self);
        _trace(type, name, 'registered');
        return;
      }
      _trace.err(type, name, ' is duplicate');
    };

    /* 註冊 library */
    self.regLib = caro.partial(regTheIndexObj, 'lib');
    self.regServ = caro.partial(regTheIndexObj, 'serv');
  })(self);
  (function(self, $) {

    /* ctrl and module */
    var reg;
    reg = function(type, name, fn, page) {
      var typeDomObj, typeObj;
      if (!fn) {
        return _trace.err('ctrl', name, 'without function');
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
    self.regCtrl = caro.partial(reg, 'ctrl');
    return self.regModule = caro.partial(reg, 'module');
  })(self, $);
  (function(self, window, caro) {

    /* config 相關 */
    var _cfg;
    _cfg = self.$$config;
    self.regDifCfg = function(url, cfg) {

      /* 比對符合的首頁網址, 並 assign config */
      var indexUrl, location;
      location = window.location;
      indexUrl = location.host + caro.addTail(location.pathname, '/');
      url = caro.addTail(url, '/');
      if (indexUrl !== url) {
        return;
      }
      caro.forEach(cfg, function(subCfg, subCfgKey) {
        return _cfg[subCfgKey] = caro.assign(_cfg[subCfgKey], subCfg);
      });
    };
    self.config = function(key, val) {
      if (typeof val !== 'undefined') {
        return _cfg[key] = val;
      }
      return _cfg[key];
    };
  })(self, window, caro);
  (function(window) {

    /* 設定相關 */
    var ieVer, location, md;
    md = new MobileDetect(window.navigator.userAgent);
    ieVer = md.version('IE');
    location = window.location;
    self.isLocal = location.hostname === 'localhost';
    self.isHttps = location.protocol.indexOf('https:') === 0;

    /* 手機 */
    self.isPhone = md.phone();

    /* 平板 */
    self.isTablet = md.tablet();

    /* 手機 and 平板 */
    self.isMobile = md.mobile();

    /* IE 版本 */
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
