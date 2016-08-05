
/* 一些單元程式 */
cf.regLib('unit', function(cf) {
  var $, caro, self, window;
  self = {};
  caro = cf.require('caro');
  window = cf.require('window');
  $ = cf.require('$');

  /* window.open 進階版 */
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
    setTimeout(function() {
      if (!pop || pop.outerHeight === 0) {
        msg = msg || '您的瀏覽器已封鎖彈出視窗';
        if (cf.alert) {
          return cf.alert(msg);
        }
        return alert(msg);
      }
    }, 25);
  };

  /* 取得圖片真實大小 */
  self.getImgSize = function($img, cb) {
    $('<img/>').attr('src', $img.attr('src')).load(function() {
      cb({
        width: this.width({
          height: this.height
        })
      });
    });
  };

  /* 轉換成 array */
  self.coverArrIfNot = function(arr) {
    if (caro.isArray(arr)) {
      return arr;
    } else {
      return [arr];
    }
  };

  /* 是否為 jQuery 物件 */
  self.ifJquery = function(tar) {
    return tar instanceof jQuery;
  };

  /* 轉換圖片路徑 */
  self.replaceImgPath = function($target) {
    var hasHttp;
    hasHttp = function(str) {
      var index, index2;
      index = str.indexOf('http://');
      index2 = str.indexOf('https://');
      if (index > -1) {
        return index;
      }
      if (index2 > -1) {
        return index2;
      }
      return null;
    };
    $target.find('*').each(function(i, $dom) {
      var background, backgroundImage, img, index, src, url;
      $dom = $($dom);

      /* 置換圖片路徑 */
      src = $dom.attr('src');
      if (src && src.indexOf('images/') > -1) {
        src = src.replace('images/', '');
        $dom.attr('src', cf.website.getImgUrl(src));
      }

      /* 置換背景圖片路徑 */
      background = $dom.css('background');
      backgroundImage = $dom.css('background-image');
      if (background) {
        index = hasHttp(background);
        if (index !== null) {
          url = background.substring(index, background.indexOf('")'));
        }
      }
      if (backgroundImage) {
        index = hasHttp(background);
        if (index !== null) {
          url = background.substring(index, background.indexOf('")'));
        }
      }
      if (url) {
        img = url.substr(url.lastIndexOf('/') + 1);
        return $dom.css('background-image', 'url(' + cf.website.getImgUrl(img) + ')');
      }
    });
  };
  return self;
});
