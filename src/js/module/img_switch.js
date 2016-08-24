
/*
img 切換圖片
 */
cf.regModule('cfImgSwitch', function(imgArr) {
  var $self, currentIndex, interval;
  $self = this;
  currentIndex = 0;
  interval = null;

  /* 切換圖片 */
  $self.switchImg = function(i) {
    if (i == null) {
      i = currentIndex;
    }
    i++;
    if (i > imgArr.length - 1) {
      i = 0;
    }
    $self.src(imgArr[i]);
    currentIndex = i;
    return $self;
  };

  /* 自動切換圖片 */
  $self.autoSwitch = function(ms) {
    var count;
    if (ms == null) {
      ms = 1000;
    }
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
