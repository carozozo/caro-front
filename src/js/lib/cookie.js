
/*
cookie 相關
 */
cf.regLib('cookie', function(cf) {
  var _trace, caro, document, self;
  self = {};
  caro = cf.require('caro');
  document = cf.require('document');
  _trace = cf.genTraceFn('cookie');

  /* 設置 cookie */
  self.setCookie = function(cookieName, val, opt) {
    var _domain, _exdays, _path, cookieStrArr, date, domain, expires, path;
    if (opt == null) {
      opt = {};
    }
    if (caro.isUndefined(val)) {
      _trace.err('Can not set undefined to cookie:', cookieName);
      return;
    }
    _exdays = opt.exdays;
    _path = opt.path;
    _domain = opt.domain;
    cookieStrArr = [cookieName + '=' + cf.toJson(val)];
    if (_exdays) {
      _exdays = !cf.isNaN(parseInt(_exdays)) ? parseInt(_exdays) : 1;
      date = new Date;
      date.setTime(date.getTime() + (_exdays * 24 * 60 * 60 * 1000));
      expires = 'expires=' + date.toUTCString();
      cookieStrArr.push(expires);
    }
    if (_path) {
      path = 'path=' + caro.addHead(_path, '/');
      cookieStrArr.push(path);
    }
    if (_domain) {
      domain = 'domain=' + _domain;
      cookieStrArr.push(domain);
    }
    document.cookie = cookieStrArr.join(';');
  };

  /* 取得 cookie */
  self.getCookie = function(name) {
    var cookieArr, ret;
    cookieArr = document.cookie.split(';');
    ret = '';
    caro.forEach(cookieArr, function(cookie) {
      var cookieName;
      cookieArr = cookie.split('=');
      cookieName = cookieArr[0].trim();
      if (cookieName !== name) {
        return true;
      }
      ret = JSON.parse(cookieArr[1]);
    });
    return ret;
  };
  return self;
});
