
/* 一些網站支援程式 */
cf.regServ('website', function(cf) {
  var _cfg, caro, location, self, window;
  self = {};
  caro = cf.require('caro');
  window = cf.require('window');
  location = cf.require('location');
  _cfg = cf.config('website');

  /* 取得 images 路徑 */
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
