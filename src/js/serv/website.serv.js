
/* 一些網站支援程式 */
cf.regServ('website', function(cf) {
  var _cfg, caro, location, self, window;
  self = {};
  caro = cf.require('caro');
  window = cf.require('window');
  location = window.location;
  _cfg = cf.config('website');

  /* url 相關 */
  (function(_cfg) {
    self.getImgUrl = function(imgFileName) {
      var imgUrl;
      if (imgFileName == null) {
        imgFileName = '';
      }
      imgUrl = _cfg.imgUrl || 'images/';
      if (imgFileName.indexOf('/') === 0) {
        imgFileName = imgFileName.replace('/', '');
      }
      return imgUrl + imgFileName.replace('images/', '');
    };
  })(_cfg);

  /* window 相關 */
  (function(window) {
    self.open = function(url, specs, replace, msg) {
      var pop;
      pop = null;
      if (specs && replace) {
        pop = window.open(url, specs, replace);
      } else if (specs) {
        pop = window.open(url, specs);
      } else {
        pop = window.open(url);
      }
      return setTimeout(function() {
        if (!pop || pop.outerHeight === 0) {
          msg = msg || '您的瀏覽器已封鎖彈出視窗';
          if (cf.alert) {
            return cf.alert(msg);
          }
          return alert(msg);
        }
      }, 25);
    };
  })(window);

  /* init */
  (function(_cfg, location) {
    var redirectPhone;
    if (cf.isLocal) {
      return;
    }
    redirectPhone = _cfg.redirectPhone;
    if (redirectPhone && cf.isPhone) {
      if (redirectPhone.indexOf('http') === 0) {
        location.href = redirectPhone;
        return;
      }
      if (redirectPhone.indexOf('/') === 0) {
        redirectPhone = redirectPhone.replace('/', '');
      }
      location.href = cf.router.indexUrl + redirectPhone;
    }
  })(_cfg, location);
  return self;
});
