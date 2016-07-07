
/* img 切換圖片 */
cf.regModule('caroImgSwitch', function() {
  var $self, caro, cf, currentIndex, imgArr, interval;
  $self = this;
  cf = $self.cf;
  currentIndex = 0;
  caro = cf.require('caro');
  imgArr = caro.values(arguments);
  interval = null;
  $self.addImg = function(imgSrc) {
    imgArr.push(imgSrc);
  };
  $self.switchImg = function(i) {
    if (caro.isUndefined(i)) {
      i = currentIndex;
    }
    if (i > imgArr.length - 1) {
      i = 0;
    }
    $self.src(imgArr[i]);
    currentIndex = ++i;
  };
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
  };
  $self.stop = function() {
    clearInterval(interval);
  };
  return $self;
});
