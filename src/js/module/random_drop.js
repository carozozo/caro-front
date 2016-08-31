
/*
隨機產生滑落物件, 例如水滴, 氣泡效果
Depend on gsap
 */
cf.regModule('cfRandomDrop', function($imgArr, opt) {
  var $, $self, $window, Power2, _isKeepDrop, amount, caro, cf, createDrop, getLengthIfFn, getRandomInRange, imgLength, inEndDuration, inStartDuration, maxDistance, maxDuration, maxRandomMs, maxStartX, maxStartY, minDistance, minDuration, minRandomMs, minScale, minStartX, minStartY, pickupImg, randomBezierArray, randomDuration, randomInEndDuration, randomInStartDuration, randomLeft, randomMs, randomNewTop, randomTop, reverse, rotationRange, tl, tm, xRange;
  if (opt == null) {
    opt = {};
  }
  $self = this;
  cf = $self.cf;
  $ = cf.require('$');
  caro = cf.require('caro');
  tm = cf.require('TweenMax');
  tl = cf.require('TimelineMax');
  Power2 = cf.require('Power2');
  $window = cf.$window;
  _isKeepDrop = true;

  /* 產生物件的 x 軸範圍 */
  minStartX = opt.minStartX || 0;
  maxStartX = opt.maxStartX || function() {
    return $self.width();
  };

  /* 產生物件的 y 軸範圍 */
  minStartY = opt.minStartY || 0;
  maxStartY = opt.maxStartY || function() {
    return $self.height();
  };

  /* 間隔最短多少毫秒產生新滑落物件 */
  minRandomMs = opt.minRandomMs || 0;

  /* 間隔最長多少毫秒產生新物件 */
  maxRandomMs = opt.maxRandomMs || minRandomMs + 1000;

  /* 滑落物件產生時, 要停留在原地的秒數 */
  inStartDuration = opt.inStartDuration || 0;

  /* 滑落物件移動完成時, 要停留在原地的秒數 */
  inEndDuration = opt.inEndDuration || 0;

  /* 最小移動秒數 */
  minDuration = opt.minDuration || 3;

  /* 最大移動秒數 */
  maxDuration = opt.maxDuration || 5;

  /* 最小移動距離 */
  minDistance = opt.minDistance || 0;

  /* 最大移動距離 */
  maxDistance = opt.maxDistance || function() {
    return $self.height();
  };

  /* 每次隨機產生的滑落物件最小縮放值 */
  minScale = opt.minScale || 1;

  /* 移動時的旋轉角度範圍 */
  rotationRange = opt.rotationRange || 0;

  /* 橫向移動範圍 */
  xRange = opt.xRange || 0;

  /* 反轉方向 */
  reverse = opt.reverse;

  /* 每次產生的滑落物件數量 */
  amount = opt.amount || 1;
  imgLength = $imgArr.length;
  caro.forEach($imgArr, function($img) {
    $img.css({
      position: 'absolute'
    });
  });
  pickupImg = function() {
    var $img, random, scale;
    random = Math.floor(Math.random() * imgLength);
    $img = $imgArr[random].clone(true);
    scale = Math.random() * (1 - minScale) + minScale;
    tm.set($img, {
      scale: scale
    });
    return $img;
  };
  getLengthIfFn = function(distance) {
    if (caro.isFunction(distance)) {
      return distance();
    } else {
      return distance;
    }
  };
  getRandomInRange = function(start, end) {
    return Math.random() * (end - start) + start;
  };
  randomMs = function() {
    return getRandomInRange(minRandomMs, maxRandomMs);
  };
  randomInStartDuration = function() {
    return Math.random() * inStartDuration;
  };
  randomInEndDuration = function() {
    return Math.random() * inEndDuration;
  };
  randomDuration = function() {
    return getRandomInRange(minDuration, maxDuration);
  };
  randomLeft = function(imgWidth) {
    var imgMaxX, maxStart, minStart;
    maxStart = getLengthIfFn(maxStartX);
    minStart = getLengthIfFn(minStartX);
    imgMaxX = maxStart - imgWidth;
    return getRandomInRange(minStart, imgMaxX);
  };
  randomTop = function(imgHeight) {
    var imgMaxY, maxStart, minStart;
    maxStart = getLengthIfFn(maxStartY);
    minStart = getLengthIfFn(minStartY);
    imgMaxY = maxStart - imgHeight;
    return getRandomInRange(minStart, imgMaxY);
  };
  randomNewTop = function(imgHeight, top) {
    var distance, imgMaxY, maxDis, newTop;
    maxDis = getLengthIfFn(maxDistance);
    distance = getRandomInRange(minDistance, maxDis);
    if (!reverse) {
      imgMaxY = $self.height() - imgHeight;
      newTop = top + distance;
      if (newTop > imgMaxY) {
        newTop = imgMaxY;
      }
    } else {
      newTop = top - distance;
      if (newTop < 0) {
        newTop = 0;
      }
    }
    return newTop;
  };
  randomBezierArray = function() {
    var x;
    x = Math.random() * xRange;
    if (Math.random() > 0.5) {
      return [
        {
          x: x
        }, {
          x: -x
        }, {
          x: 0
        }
      ];
    }
    return [
      {
        x: -x
      }, {
        x: x
      }, {
        x: 0
      }
    ];
  };
  createDrop = function(opt) {
    var $img, distance, duration, imgHeight, imgWidth, isKeepDrop, left, newTop, objForMove, rotation, tl1, tl2, top;
    if (opt == null) {
      opt = {};
    }
    $img = pickupImg();
    imgWidth = $img.width();
    imgHeight = $img.height();
    left = opt.left || randomLeft(imgWidth);
    top = opt.top || randomTop(imgHeight);
    isKeepDrop = caro.isBoolean(opt.isKeepDrop) ? opt.isKeepDrop : _isKeepDrop;
    newTop = randomNewTop(imgHeight, top);
    duration = randomDuration();
    distance = Math.abs(top - newTop);
    tm.set($img, {
      opacity: 0,
      top: top,
      left: left
    });
    $self.append($img);
    tl1 = new tl();
    objForMove = {
      top: newTop,
      ease: Power2.easeIn
    };
    if (xRange && distance > 50) {
      objForMove.bezier = randomBezierArray();
    }
    tl1.to($img, 0.2, {
      opacity: 1
    }).to($img, duration, objForMove, '+=' + randomInStartDuration()).to($img, 0.2, {
      opacity: 0,
      onComplete: function() {
        $img.remove();
      }
    }, '+=' + randomInEndDuration());
    if (rotationRange) {
      tl2 = new tl();
      rotation = caro.randomInt(rotationRange, -rotationRange);
      tl2.to($img, duration, {
        rotation: rotation
      }, '+=0.3');
    }
    if (!isKeepDrop) {
      return;
    }
    return setTimeout(function() {
      return createDrop();
    }, randomMs());
  };

  /* 開始產生滑落物件 */
  $self.startDrop = function() {
    var trigger1, trigger2;
    _isKeepDrop = true;
    if (amount > 1) {
      caro.loop(function() {
        return createDrop();
      }, 1, amount);
    } else {
      createDrop();
    }
    trigger1 = 'focusout.cfRandomDrop';
    trigger2 = 'focus.cfRandomDrop';
    $window.on(trigger1, function() {
      _isKeepDrop = false;
    });
    $window.on(trigger2, function() {
      $self.startDrop();
    });
    return $self;
  };

  /* 停止產生滑落物件 */
  $self.stopDrop = function() {
    _isKeepDrop = false;
    return $self;
  };

  /* 當 click 時, 產生滑落物件 */
  $self.clickCreate = function() {
    var triggerName;
    triggerName = 'click.cfRandomDrop';
    $self.on(triggerName, function(e) {
      var left, mouseX, mouseY, selfOffset, top;
      mouseX = e.pageX;
      mouseY = e.pageY;
      selfOffset = $self.offset();
      left = mouseX - selfOffset.left;
      top = mouseY - selfOffset.top;
      return createDrop({
        left: left,
        top: top,
        isKeepDrop: false
      });
    });
    return $self;
  };

  /* 當 mousemove, 產生滑落物件 */
  $self.moveCreate = function(interval) {
    var count, triggerMoveFn, triggerName1, triggerName2;
    if (interval == null) {
      interval = 10;
    }
    count = 0;
    interval = parseInt(interval, 10) || 10;
    triggerMoveFn = function(e) {
      var left, mouseX, mouseY, offset, targetTouches, top;
      if (++count % interval !== 0) {
        return;
      }
      count = 0;
      targetTouches = e.originalEvent && e.originalEvent.targetTouches || [{}];
      mouseX = e.pageX || targetTouches.pageX;
      mouseY = e.pageY || targetTouches.pageY;
      offset = $self.offset();
      left = mouseX - offset.left;
      top = mouseY - offset.top;
      return createDrop({
        left: left,
        top: top,
        isKeepDrop: false
      });
    };
    triggerName1 = 'mousemove.cfRandomDrop';
    triggerName2 = 'touchmove.cfRandomDrop';
    $self.on(triggerName1, triggerMoveFn);
    $self.on(triggerName2, triggerMoveFn);
    return $self;
  };
  return $self.css({
    position: 'relative'
  });
});
