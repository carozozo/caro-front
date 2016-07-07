
/* 用圖片顯示數字, 需搭配圖檔 */
cf.regModule('caroPicNum', function() {
  var $imgArr, $imgs, $self, cf, tweenMax;
  $self = this;
  cf = $self.cf;
  tweenMax = cf.require('TweenMax');
  $imgs = $self.find('img');
  $imgArr = caro.filter($imgs, function(val, key) {
    return caro.isNumber(key);
  });

  /* 反轉, 圖片從個位數開始 */
  $imgArr.reverse();

  /* num=要顯示的數字, numHeight=數字圖片中每個數字的高度 */
  $self.showNum = function(num, numHeight, speed) {
    var numArr, numStr;
    speed = speed || 0.5;

    /* 不用 num.toString, IE8 不支援 */
    numStr = num + '';
    numArr = numStr.split('');

    /* 反轉, 數字從個位數開始 */
    numArr.reverse();
    caro.forEach($imgArr, function($numImg, i) {
      var eachNum;
      eachNum = numArr[i];
      if (!eachNum) {
        return true;
      }
      $numImg = $($numImg);
      tweenMax.fromTo($numImg, speed, {
        'margin-top': 0
      }, {
        'margin-top': -(numHeight * eachNum)
      });
    });
  };
  return $self;
});
