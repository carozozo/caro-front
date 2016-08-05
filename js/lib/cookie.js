
/* cookie 相關 */
cf.regLib('cookie', function(cf) {
  var _trace, caro, document, genCookieName, self, window;
  self = {};
  caro = cf.require('caro');
  window = cf.require('window');
  document = cf.require('document');
  _trace = cf.genTraceFn('cookie');
  genCookieName = function(name) {
    return 'CaroFront' + name;
  };

  /* 設置 cookie */
  self.setCookie = function(cookieName, val, exdays) {
    var cookieStrArr, date, expires, path;
    if (caro.isUndefined(val)) {
      _trace.err('Can not set undefined to cookie:', cookieName);
      return;
    }
    if (exdays) {
      exdays = !caro.isNaN(parseInt(exdays)) ? parseInt(exdays) : 1;
      date = new Date;
      date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
      expires = 'expires=' + date.toUTCString();
    }
    path = '; path=' + cf.indexUrl;
    cookieStrArr = [genCookieName(cookieName) + '=' + caro.toJson(val)];
    caro.pushNoEmptyVal(cookieStrArr.push(expires));
    cookieStrArr.push(path);
    document.cookie = cookieStrArr.join('; ');
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
      if (cookieName !== genCookieName(name)) {
        return true;
      }
      ret = JSON.parse(cookieArr[1]);
    });
    return ret;
  };
  return self;
});
