
/* 一些單元程式 */
cf.regLib('unit', function(cf) {
  var $, _cfg, _imgPath, caro, location, self, window;
  $ = cf.require('$');
  caro = cf.require('caro');
  window = cf.require('window');
  location = cf.require('location');
  _cfg = cf.config('unit') || {};
  self = {};
  _imgPath = _cfg.imgPath ? caro.addTail(_cfg.imgPath, '/') : 'images/';

  /* window.open 進階版 */
  self.open = function() {
    var pop;
    pop = null;
    window.open.apply(window, arguments);
    setTimeout(function() {
      var msg;
      if (!pop || pop.outerHeight === 0) {
        msg = '您的瀏覽器已封鎖彈出視窗';
        if (cf.alert) {
          return cf.alert(msg);
        }
        return alert(msg);
      }
    }, 25);
  };

  /* 判斷是否為 jQuery 物件 */
  self.ifJquery = function(arg) {
    return arg instanceof jQuery;
  };

  /* 取得圖片真實寬高 */
  self.getImgSize = function($img, cb) {
    $('<img/>').attr('src', $img.attr('src')).load(function() {
      cb(this.width, this.height);
    });
  };

  /* 取得圖片路徑 */
  self.getImgPath = function(imgFileName) {
    if (imgFileName == null) {
      imgFileName = '';
    }
    if (imgFileName.indexOf('/') === 0) {
      imgFileName = imgFileName.replace('/', '');
    }
    return _imgPath + imgFileName;
  };

  /* 轉換 $dom 的圖片路徑, 由 css 設定的同樣有效 */
  self.replaceImgPath = function($dom, imgPath) {
    var back, background, backgroundImage, setFilePath, src, url;
    if (imgPath == null) {
      imgPath = _imgPath;
    }
    imgPath = caro.addTail(imgPath, '/');
    setFilePath = function(path) {
      var fileName;
      fileName = path.substr(path.lastIndexOf('/') + 1);
      return imgPath + fileName;
    };

    /* 置換圖片路徑 */
    src = $dom.attr('src');
    if (src) {
      $dom.attr('src', setFilePath(src));
    }

    /* 置換背景圖片路徑 */
    background = $dom.css('background');
    backgroundImage = $dom.css('background-image');
    back = background || backgroundImage;
    if (back) {
      url = background.substring(back.indexOf('("') + 2, back.indexOf('")'));
      if (url) {
        $dom.css('background-image', 'url(' + setFilePath(url) + ')');
      }
    }
  };
  return self;
});
