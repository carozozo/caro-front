
/* 客製化 facebook api 呼叫程式 */
cf.regLib('fb', function(cf) {
  var _alert, _appId, _authResponse, _cfg, _initCbMap, _isPhone, _isReady, _isUserConnected, _nowUrl, _redirectAfterLogin, _sdkVersion, _shareUrl, _trace, _urlAftLogin, caro, genApiObj, getFbResErrObj, init, initLoginResponseAncCallCb, runFb, self, window;
  self = {};
  caro = cf.require('caro');
  window = cf.require('window');
  _alert = cf.alert || cf.require('alert');
  _cfg = cf.config('fb');
  _isPhone = cf.isPhone;
  _appId = _cfg.appId;
  _sdkVersion = _cfg.sdkVersion;
  _redirectAfterLogin = _cfg.redirectAfterLogin;
  _shareUrl = _cfg.shareUrl;
  _initCbMap = {};
  _isReady = false;

  /* https://developers.facebook.com/docs/facebook-login/permissions */
  _isUserConnected = false;
  _authResponse = {};
  _nowUrl = cf.nowUrl;

  /* 取得登入 FB 後要跳轉的網址 */
  _urlAftLogin = (function() {
    var pageAfterLogin, urlArr;
    urlArr = ['https://'];
    urlArr.push(_isPhone ? 'm' : 'www');
    urlArr.push('.facebook.com/dialog/oauth?client_id=' + _appId + '&scope=&auth_type=rerequest');
    pageAfterLogin = _redirectAfterLogin ? caro.addTail(_redirectAfterLogin, '.html') : _nowUrl;
    urlArr.push('&redirect_uri=' + pageAfterLogin);
    return urlArr.join('');
  })();
  _trace = cf.genTraceFn('fb');
  genApiObj = function() {
    var obj;
    obj = {};
    obj.suc = function(cb) {
      obj.sucCb = cb;
      return obj;
    };
    obj.err = function(cb) {
      obj.errCb = cb;
      return obj;
    };
    return obj;
  };
  init = function() {
    _trace('Start init:', _appId);
    FB.init({
      appId: _appId,
      status: true,
      cookie: true,
      xfbml: true,
      version: _sdkVersion
    });
    caro.forEach(_initCbMap, function(cb, name) {
      _trace('Execute callback: ', name);
      cb();
    });
    _isReady = true;
  };
  runFb = function(fn) {
    var apiObj;
    if (!_isReady) {
      return _alert('Facebook 登入功能正在準備中, 請稍後再試');
    }
    if (!FB) {
      return _alert('Facebook 功能異常, 請稍後再試');
    }
    apiObj = genApiObj();
    fn(apiObj);
    return apiObj;
  };
  getFbResErrObj = function(res) {
    if (res.error || res.error_message || res.error_code) {
      return {
        err: res.error,
        code: res.error_code,
        msg: res.error_message
      };
    }
    return null;
  };

  /* 判斷 login 狀況並呼叫相關 cb */
  initLoginResponseAncCallCb = function(res, sucCb, errCb) {
    var resErrObj, status;
    _trace('Login response =', res);
    if (!res) {
      _alert('Facebook 功能異常, 請稍後再試');
      _trace.err('Can not get Fb login response');
      return errCb && errCb();
    }
    resErrObj = getFbResErrObj(res);
    if (resErrObj) {
      return errCb && errCb(resErrObj);
    }
    status = res.status;
    if (status === 'connected') {
      _authResponse = res.authResponse;
      _isUserConnected = true;
      sucCb && sucCb();
      return;
    }
    if (status === 'not_authorized') {
      _isUserConnected = false;
      _trace.err('Is logged into Facebook, but not with app');
      return errCb && errCb(status);
    }
    _isUserConnected = false;
    _trace('Is not logged into Facebook');
  };

  /* 註冊, 當 FB init 完成後要執行的 cb */
  self.regInitCb = function(name, cb) {
    if (!_initCbMap[name]) {
      _initCbMap[name] = cb;
      _trace('Init callback: ' + name + ' registered');
    } else {
      _trace('Init callback: ' + name + ' is duplicate');
    }
  };

  /* 判斷 FB 是否 ready */
  self.isReady = function() {
    return _isReady;
  };

  /* 取得 FB APP id */
  self.getAppId = function() {
    return _appId;
  };

  /* 取得 user id */
  self.getUserId = function() {
    var userId;
    _trace('Start getUserId');
    userId = _authResponse.userID;
    if (userId) {
      return userId;
    }
    return null;
  };

  /* 取得 user token */
  self.getAccessToken = function() {
    var accessToken;
    _trace('Start getAccessToken');
    accessToken = _authResponse.accessToken;
    if (accessToken) {
      return accessToken;
    }
    return null;
  };

  /* 取得登入狀態 */
  self.getLoginStatus = function() {

    /* https://developers.facebook.com/docs/reference/javascript/FB.getLoginStatus/ */
    _trace('Start getLoginStatus');
    runFb(function(apiObj) {
      return FB.getLoginStatus(function(res) {
        initLoginResponseAncCallCb(res, apiObj.sucCb, apiObj.errCb);
      }, true);
    });
  };

  /* 登入 */
  self.login = function(opt) {

    /* https://developers.facebook.com/docs/reference/javascript/FB.login/ */
    _trace('Start login');
    return runFb(function(apiObj) {
      if (_isUserConnected) {
        apiObj.suc = function(cb) {
          cb && cb();
          return apiObj;
        };
        return;
      }
      if (_isPhone) {
        return window.open(_urlAftLogin, '_top');
      }
      opt = opt ? caro.assign({
        'scope': '',
        'return_scopes': true,
        'auth_type': 'rerequest'
      }, opt) : {};
      return FB.login((function(res) {
        initLoginResponseAncCallCb(res, apiObj.sucCb, apiObj.errCb);
      }), opt);
    });
  };

  /* 登出 */
  self.logout = function() {

    /* https://developers.facebook.com/docs/reference/javascript/FB.logout/ */
    _trace('Start logout');
    return runFb(function(apiObj) {
      return FB.logout(function(res) {
        initLoginResponseAncCallCb(res, apiObj.sucCb, apiObj.errCb);
      });
    });
  };

  /* 取得 user 資料 */
  self.getProfile = function(fieldArr) {

    /* https://developers.facebook.com/docs/graph-api/reference/user/ */
    _trace('Start getProfile');
    return runFb(function(apiObj) {
      fieldArr = ['id', 'name', 'email', 'gender'].concat(fieldArr || []);
      return FB.api('/me', {
        fields: fieldArr.join(',')
      }, function(res) {
        var resErrObj;
        if (!res) {
          return _trace.err('Get profile failed');
        }
        resErrObj = getFbResErrObj(res);
        if (resErrObj) {
          return apiObj.errCb && apiObj.errCb(resErrObj);
        }
        apiObj.sucCb && apiObj.sucCb(res);
      });
    });
  };

  /* 分享內容 */
  self.feed = function(opt) {
    if (opt == null) {
      opt = {};
    }

    /* https://developers.facebook.com/docs/sharing/reference/feed-dialog/ */
    _trace('Start feed');
    return runFb(function(apiObj) {
      var $, displayArr, param;
      $ = cf.require('$');
      param = opt;
      displayArr = ['popup', 'dialog', 'iframe', 'touch', 'async', 'hidden', 'none'];
      param.method = 'feed';
      param.link = _shareUrl || _nowUrl;
      param.caption = param.caption || param.link;
      if (param.display && displayArr.indexOf(param.display) < 0) {
        delete param.display;
      }
      _trace('Feed param =', param);
      return FB.ui(param, function(res) {
        var resErrObj;
        _trace('Feed response:', res);
        if (!res) {
          return _trace.err('Feed failed');
        }
        resErrObj = getFbResErrObj(res);
        if (resErrObj) {
          return apiObj.errCb && apiObj.errCb(resErrObj);
        }
        apiObj.sucCb && apiObj.sucCb(res);
      });
    });
  };

  /* 當 FB 的 script 被置入後, 會呼叫此程式 */
  window.fbAsyncInit = function() {
    init();
    self.getLoginStatus();
  };
  return self;
});

cf.regDocReady(function(cf) {
  var _cfg, _isDownloadSdk, _trace, downloadSdk;
  _cfg = cf.config('fb');
  _isDownloadSdk = _cfg.isDownloadSdk;
  _trace = cf.genTraceFn('fb');
  downloadSdk = function() {
    _trace('Start download facebook SDK');
    (function(d, s, id) {
      var fjs, js;
      js = void 0;
      fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = '//connect.facebook.net/zh_TW/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  };
  if (_isDownloadSdk) {
    downloadSdk();
  }
});
