
/* 客製化 facebook api 呼叫程式 */
cf.regServ('fb', function(cf) {
  var _appId, _authResponse, _cfg, _initCbMap, _isReady, _isUserConnected, _redirectAfterLogin, _shareUrl, _trace, caro, genApiObj, getFbLoginUrl, getFbResErrObj, getPermissions, init, initLoginResponseAncCallCb, runFb, self, window;
  self = {};
  caro = cf.require('caro');
  window = cf.require('window');
  _cfg = cf.config('fb');
  _appId = _cfg.appId;
  _redirectAfterLogin = _cfg.redirectAfterLogin;
  _shareUrl = _cfg.shareUrl;
  _initCbMap = {};
  _isReady = false;

  /* https://developers.facebook.com/docs/facebook-login/permissions */
  _isUserConnected = false;
  _authResponse = {};
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
      version: 'v2.6'
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
      return cf.alert('Facebook 登入功能正在準備中, 請稍後再試');
    }
    if (!FB) {
      return cf.alert('Facebook 功能異常, 請稍後再試');
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
  initLoginResponseAncCallCb = function(res, sucCb, errCb) {
    var resErrObj, status;
    _trace('Login response =', res);
    if (!res) {
      cf.alert('Facebook 功能異常, 請稍後再試');
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
  getFbLoginUrl = function() {
    var pageAfterLogin, urlArr;
    urlArr = ['https://'];
    pageAfterLogin = cf.website.getIndexUrl();
    urlArr.push(cf.isPhone ? 'm' : 'www');
    urlArr.push('.facebook.com/dialog/oauth?client_id=' + _appId + '&scope=&auth_type=rerequest');
    if (_redirectAfterLogin) {
      pageAfterLogin += _redirectAfterLogin + '.html';
    }
    urlArr.push('&redirect_uri=' + pageAfterLogin);
    return urlArr.join('');
  };
  getPermissions = function() {
    _trace('Start getPermissions');
    FB.api('/me/permissions', function(res) {});
  };
  self.regInitCb = function(name, cb) {
    if (!_initCbMap[name]) {
      _initCbMap[name] = cb;
      _trace('Init callback: ' + name + ' registered');
    } else {
      _trace('Init callback: ' + name + ' is duplicate');
    }
  };
  self.isReady = function() {
    return _isReady;
  };
  self.getAppId = function() {
    return _appId;
  };
  self.getUserId = function() {
    var userId;
    _trace('Start getUserId');
    userId = _authResponse.userID;
    if (userId) {
      return userId;
    }
    return null;
  };
  self.getAccessToken = function() {
    var accessToken;
    _trace('Start getAccessToken');
    accessToken = _authResponse.accessToken;
    if (accessToken) {
      return accessToken;
    }
    return null;
  };
  self.getLoginStatus = function(cb) {
    _trace('Start getLoginStatus');
    runFb(function() {
      return FB.getLoginStatus(function(res) {
        initLoginResponseAncCallCb(res);
        cb && cb();
      });
    });
  };
  self.login = function(opt) {
    _trace('Start login');
    return runFb(function(apiObj) {
      var url;
      if (_isUserConnected) {
        apiObj.suc = function(cb) {
          cb && cb();
          return apiObj;
        };
        return;
      }
      if (cf.isPhone) {
        url = getFbLoginUrl();
        window.open(url, '_top');
        return;
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
  self.logout = function() {
    _trace('Start logout');
    return runFb(function(apiObj) {
      return FB.logout(function(res) {
        initLoginResponseAncCallCb(res, apiObj.sucCb, apiObj.errCb);
      });
    });
  };
  self.getProfile = function(fieldArr) {

    /* https://developers.facebook.com/docs/graph-api/reference/user */
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
  self.feed = function(opt) {

    /* https://developers.facebook.com/docs/sharing/reference/feed-dialog/v2.5 */
    _trace('Start feed');
    return runFb(function(apiObj) {
      var $, displayArr, param;
      $ = cf.require('$');
      param = opt || {};
      displayArr = ['popup', 'dialog', 'iframe', 'touch', 'async', 'hidden', 'none'];
      param.method = 'feed';
      param.link = _shareUrl || cf.website.getIndexUrl();
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
  window.fbAsyncInit = function() {
    init();
    self.getLoginStatus();
  };
  return self;
});

cf.regDocReady('fb', function(cf) {
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
