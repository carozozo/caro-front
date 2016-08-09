
/* img 切換圖片 */
cf.regModule('cfImgSwitch', function() {
  var $self, caro, cf, currentIndex, imgArr, interval;
  $self = this;
  cf = $self.cf;
  currentIndex = 0;
  caro = cf.require('caro');
  imgArr = caro.values(arguments);
  interval = null;

  /* 新增圖片路徑 */
  $self.addImg = function(imgSrc) {
    imgArr.push(imgSrc);
    return $self;
  };

  /* 切換圖片 */
  $self.switchImg = function(i) {
    if (caro.isUndefined(i)) {
      i = currentIndex;
    }
    if (i > imgArr.length - 1) {
      i = 0;
    }
    $self.src(imgArr[i]);
    currentIndex = ++i;
    return $self;
  };

  /* 自動切換圖片 */
  $self.autoSwitch = function(ms) {
    var count;
    count = 0;
    interval = setInterval((function() {
      var src;
      src = imgArr[count];
      $self.src(src);
      count++;
      if (count > imgArr.length - 1) {
        count = 0;
      }
    }), ms);
    return $self;
  };

  /* 停止切換圖片 */
  $self.stopSwitch = function() {
    clearInterval(interval);
    return $self;
  };
  return $self;
});
