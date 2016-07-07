
/* 隨機產生滑落物件, 例如氣泡, 水滴效果, 需搭配圖檔 */
cf.regModule('caroRandomDrop', function($imgArr, opt) {
  var $, $container, $self, $window, Power2, _containerLeft, _containerTop, _isKeepDrop, _selfHeight, amount, caro, cf, createDrop, getLengthIfFn, getRandomInRange, imgLength, inEndDuration, inStartDuration, maxDistance, maxDuration, maxRandomMs, maxStartX, maxStartY, minDistance, minDuration, minRandomMs, minScale, minStartX, minStartY, pickupImg, randomBezierArray, randomDuration, randomInEndDuration, randomInStartDuration, randomLeft, randomMs, randomNewTop, randomTop, reverse, rotationRange, tl, tm, xRange;
  if (opt == null) {
    opt = {};
  }
  $self = this;
  cf = $self.cf;
  $ = cf.require('$');
  caro = cf.require('caro');
  tm = cf.require('TweenMax');
  tl = cf.require('TimelineMax');
  tl = cf.require('TimelineMax');
  Power2 = cf.require('Power2');
  $window = cf.$window;
  _isKeepDrop = true;
  $container = $('<div/>').addClass('caroRandomDropContainer');
  _selfHeight = $self.height();

  /* 產生物件的 x 軸範圍 */
  minStartX = opt.minStartX || 0;
  maxStartX = opt.maxStartX || function() {
    return $container.width();
  };

  /* 產生物件的 y 軸範圍 */
  minStartY = opt.minStartY || 0;
  maxStartY = opt.maxStartY || function() {
    return $container.height();
  };
  $container.css({
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0
  }).appendTo($self);
  _containerLeft = $container.offset().left;
  _containerTop = $container.offset().top;
  minRandomMs = opt.minRandomMs || 0;
  maxRandomMs = opt.maxRandomMs || minRandomMs + 1000;
  inStartDuration = opt.inStartDuration || 0;
  inEndDuration = opt.inEndDuration || 0;
  minDuration = opt.minDuration || 3;
  maxDuration = opt.maxDuration || 5;
  minDistance = opt.minDistance || 0;
  maxDistance = opt.maxDistance || function() {
    return $container.height();
  };
  minScale = opt.minScale || 1;
  rotationRange = opt.rotationRange || 0;
  xRange = opt.xRange || 0;
  reverse = opt.reverse || false;
  amount = opt.amount || 1;
  imgLength = $imgArr.length;
  caro.forEach($imgArr, function($img) {
    return $img.css({
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
      imgMaxY = _selfHeight - imgHeight;
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
    $img.css({
      opacity: 0,
      left: left,
      top: top
    });
    $container.append($img);
    tl1 = new tl();
    objForMove = {
      top: newTop,
      ease: Power2.easeIn
    };
    if (xRange && distance > 50) {
      objForMove.bezier = randomBezierArray();
    }
    tl1.to($img, 0.3, {
      opacity: 1
    }).to($img, duration, objForMove, '+=' + randomInStartDuration()).to($img, 0.3, {
      opacity: 0,
      onComplete: function() {
        return $img.remove();
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
  $self.stopDrop = function() {
    _isKeepDrop = false;
    return $self;
  };
  $self.startDrop = function(nameSpace) {
    var trigger1, trigger2;
    _isKeepDrop = true;
    if (amount > 1) {
      caro.loop(function() {
        return createDrop();
      }, 1, amount);
    } else {
      createDrop();
    }
    trigger1 = 'blur.caroRandomDrop.' + nameSpace;
    trigger2 = 'focus.caroRandomDrop.' + nameSpace;
    $window.off(trigger1).on(trigger1, function() {
      return _isKeepDrop = false;
    });
    $window.off(trigger2).on(trigger2, function() {
      return $self.startDrop(nameSpace);
    });
    return $self;
  };
  $self.clickCreate = function($target, nameSpace) {
    var triggerName;
    if ($target == null) {
      $target = $container;
    }
    triggerName = 'click.caroRandomDrop';
    if (nameSpace) {
      triggerName += '.' + nameSpace;
    }
    $target.off(triggerName).on(triggerName, function(e) {
      var left, mouseX, mouseY, top;
      mouseX = e.pageX;
      mouseY = e.pageY;
      left = mouseX - _containerLeft;
      top = mouseY - _containerTop;
      return createDrop({
        left: left,
        top: top,
        isKeepDrop: false
      });
    });
    return $self;
  };
  $self.moveCreate = function(interval, $target, nameSpace) {
    var count, triggerMoveFn, triggerName1, triggerName2;
    if (interval == null) {
      interval = 10;
    }
    if ($target == null) {
      $target = $container;
    }
    count = 0;
    triggerMoveFn = function(e) {
      var left, mouseX, mouseY, targetTouches, top;
      if (++count % interval !== 0) {
        return;
      }
      count = 0;
      targetTouches = e.originalEvent && e.originalEvent.targetTouches || [{}];
      mouseX = e.pageX || targetTouches.pageX;
      mouseY = e.pageY || targetTouches.pageY;
      left = mouseX - _containerLeft;
      top = mouseY - _containerTop;
      return createDrop({
        left: left,
        top: top,
        isKeepDrop: false
      });
    };
    triggerName1 = 'mousemove.caroRandomDrop';
    if (nameSpace) {
      triggerName1 += '.' + nameSpace;
    }
    triggerName2 = 'touchmove.caroRandomDrop';
    if (nameSpace) {
      triggerName2 += '.' + nameSpace;
    }
    $target.off(triggerName1).on(triggerName1, triggerMoveFn);
    $target.off(triggerName2).on(triggerName2, triggerMoveFn);
    return $self;
  };
  return $self;
});
