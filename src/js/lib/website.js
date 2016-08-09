
/* 一些網站支援程式 */
cf.regLib('website', function(cf) {
  var _cfg, _imgUrl, caro, location, self, window;
  caro = cf.require('caro');
  window = cf.require('window');
  location = cf.require('location');
  _cfg = cf.config('website') || {};
  self = {};
  self.imgUrl = _imgUrl = _cfg.imgUrl ? caro.addTail(_cfg.imgUrl, '/') : 'images/';

  /* 取得 images 路徑 */
  self.getImgUrl = function(imgFileName) {
    if (imgFileName == null) {
      imgFileName = '';
    }
    if (imgFileName.indexOf('/') === 0) {
      imgFileName = imgFileName.replace('/', '');
    }
    return _imgUrl + imgFileName.replace('images/', '');
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
      location.href = cf.indexUrl + redirectPhone;
    }
  })(_cfg, location);
  return self;
});
