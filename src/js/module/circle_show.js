
/*
DOM circle 輪播效果
 */
cf.regModule('cfCircleShow', function($targetList, opt) {
  var $self, _angleDif, _brightnessDif, _brightnessMap, _cb, _currentIndex, _degreeTop, _duration, _ease, _interval, _leftMap, _minBrightness, _minScale, _radianMap, _radios, _scaleDif, _scaleMap, _targetLength, _topMap, _zIndex, _zIndexMap, caro, cf, getBrightness, getLeft, getRadians, getScale, getTop, getZindex, movePosition, tm;
  if (opt == null) {
    opt = {};
  }
  $self = this;
  cf = $self.cf;
  caro = cf.require('caro');
  tm = cf.require('TweenMax');

  /* 當前 $target 的 z-index */
  _zIndex = opt.zIndex || 999;

  /* 旋轉半徑 */
  _radios = opt.radios || 100;

  /* 移動時間 */
  _duration = opt.duration || 1;

  /* 最後面的 $target 的亮度百分比 */
  _minBrightness = opt.minBrightness || 50;

  /* 每個 target 的 top 位移量 */
  _degreeTop = opt.degreeTop || 0;

  /* 最後面的 $target 的 scale */
  _minScale = opt.minScale || 1;

  /* TweenMax ease 效果 */
  _ease = opt.ease;

  /* 可取得每個 DOM 及該 DOM 目前的 index */
  _cb = opt.cb;
  _targetLength = $targetList.length;

  /* 角度級距 */
  _angleDif = 360 / _targetLength;

  /* 亮度級距 */
  _brightnessDif = (100 - _minBrightness) / (_targetLength / 2);

  /* scale 級距 */
  _scaleDif = (1 - _minScale) / (_targetLength / 2);
  _currentIndex = 0;
  _interval = null;

  /* 用來存儲計算過的數值 */
  _radianMap = {};
  _topMap = {};
  _leftMap = {};
  _zIndexMap = {};
  _brightnessMap = {};
  _scaleMap = {};
  getRadians = function(i) {
    var degrees;
    if (_radianMap[i]) {
      return _radianMap[i];
    }

    /* 角度轉換成弧度, 起始點為 90 度 */
    degrees = _angleDif * i + 90;
    return _radianMap[i] = degrees * Math.PI / 180;
  };
  getTop = function(i) {
    if (_topMap[i]) {
      return _topMap[i];
    }
    return _topMap[i] = _degreeTop * Math.abs(_targetLength / 2 - i);
  };
  getLeft = function(i) {
    var radians, x;
    if (_leftMap[i]) {
      return _leftMap[i];
    }
    radians = getRadians(i);

    /* 位移量 */
    x = Math.cos(radians);
    return _leftMap[i] = _radios * (1 + x);
  };
  getZindex = function(i) {
    var zIndex;
    if (_zIndexMap[i]) {
      return _zIndexMap[i];
    }
    zIndex = _zIndex - (caro.min([i, _targetLength - i]) * 2);
    if (i < _targetLength / 2) {
      zIndex++;
    }
    return _zIndexMap[i] = zIndex;
  };
  getBrightness = function(i) {
    if (_brightnessMap[i]) {
      return _brightnessMap[i];
    }
    return _brightnessMap[i] = 100 - (_brightnessDif * caro.min([i, _targetLength - i]));
  };
  getScale = function(i) {
    if (_scaleMap[i]) {
      return _scaleMap[i];
    }
    return _scaleMap[i] = 1 - (_scaleDif * caro.min([i, _targetLength - i]));
  };
  movePosition = function(isSet) {
    return caro.forEach($targetList, function($target, i) {
      opt = {
        y: getTop(i),
        x: getLeft(i),
        '-webkit-filter': 'brightness(' + getBrightness(i) + '%)',
        'filter': 'brightness(' + getBrightness(i) + '%)',
        scale: getScale(i),
        ease: _ease
      };
      if (isSet) {
        tm.set($target, opt);
      } else {
        tm.to($target, _duration, opt);
      }
      tm.to($target, _duration / 4, {
        'z-index': getZindex(i)
      });
      if (i === _currentIndex) {
        _cb && _cb($target, i);
      }
    });
  };
  caro.forEach($targetList, function($target, i) {
    $target.css({
      position: 'absolute',
      y: getTop(i),
      x: getLeft(i),
      'z-index': getZindex(i),
      '-webkit-filter': 'brightness(' + getBrightness(i) + '%)',
      'filter': 'brightness(' + getBrightness(i) + '%)'
    });
  });

  /* 顯示下一個內容 */
  $self.next = function() {
    var $first;
    if (++_currentIndex === _targetLength) {
      _currentIndex = 0;
    }
    $first = $targetList.shift();
    $targetList.push($first);
    movePosition();
    return $self;
  };

  /* 顯示上一個內容 */
  $self.prev = function() {
    var $last;
    if (--_currentIndex === -1) {
      _currentIndex = _targetLength - 1;
    }
    $last = $targetList.pop();
    $targetList.unshift($last);
    movePosition();
    return $self;
  };

  /* 取得目前內容的 index */
  $self.getCurrentIndex = function() {
    return _currentIndex;
  };

  /* 自動輪播 */
  $self.autoPlay = function(ms, isNext) {
    var fn;
    if (ms == null) {
      ms = 1000;
    }
    if (isNext == null) {
      isNext = true;
    }
    fn = isNext ? $self.next : $self.prev;
    fn();
    _interval = setInterval(fn, ms);
    return $self;
  };

  /* 停止輪播 */
  $self.stopPlay = function() {
    clearInterval(_interval);
    return $self;
  };
  movePosition(true);
  return $self;
});
