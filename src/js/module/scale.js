
/*
隨目標縮放自己的大小
 */
cf.regModule('cfScale', function(nameSpace, opt) {
  var $self, $target, _aftScale, _basicHeight, _basicWidth, _befScale, _duration, _endScale, _endX, _endY, _infoObj, _isScaleX, _isScaleY, _mode, _selfInfo, _startScale, _startX, _startY, _targetInfo, _triggerName, caro, cf, getScaleX, getScaleY, setScaleInfo, setTargetInfo, tm;
  if (opt == null) {
    opt = {};
  }
  $self = this;
  cf = $self.cf;
  caro = cf.require('caro');
  tm = cf.require('TweenMax');

  /* 綁定 resize 的 name space */
  _triggerName = 'resize.cfAutoScale.' + nameSpace;

  /* 要以哪個目標的大小為依據做縮放 */
  $target = opt.$target || cf.$window;

  /* 指定觸發縮放的 $target 寬度範圍 */
  _startX = caro.isNumber(opt.startX) ? opt.startX : 1280;
  _endX = caro.isNumber(opt.endX) ? opt.endX : 1920;

  /* 指定觸發縮放的 $target 高度範圍 */
  _startY = caro.isNumber(opt.startY) ? opt.startY : 720;
  _endY = caro.isNumber(opt.endY) ? opt.endY : 1080;

  /* 指定縮放範圍 */
  _startScale = opt.startScale || 1;
  _endScale = opt.endScale || 1.2;

  /* 縮放基準, min: scaleX scaleY 取最小, max: scaleX scaleY 取最大, x: scaleX, y: scaleY */
  _mode = opt.mode || 'x';

  /* 是否縮放 $self 的寬 */
  _isScaleX = opt.isScaleX === false ? false : true;

  /* 是否縮放 $self 的高 */
  _isScaleY = opt.isScaleY;

  /* scale 時間, 單位為秒 */
  _duration = opt.duration || 0.3;

  /* scale 之前的 cb, return false 會停止 scale */
  _befScale = opt.befScale;

  /* scale 之後的 cb */
  _aftScale = opt.aftScale;

  /* 設置起始的 width */
  _basicWidth = opt.basicWidth || $self.width();

  /* 設置起始的 height */
  _basicHeight = opt.basicHeight || $self.height();
  _selfInfo = {
    width: _basicWidth,
    height: _basicHeight,
    newWidth: _basicWidth,
    newHeight: _basicHeight
  };
  _targetInfo = {
    width: null,
    height: null
  };
  _infoObj = {
    $self: $self,
    $target: $target,
    selfInfo: _selfInfo,
    targetInfo: _targetInfo,
    scale: null,
    scaleX: null,
    scaleY: null
  };
  getScaleX = function() {
    var width;
    _targetInfo.width = width = $target.width();
    if (width < _startX) {
      return _startScale;
    }
    if (width > _endX) {
      return _endScale;
    }
    return (width - _startX) * (_endScale - _startScale) / (_endX - _startX) + _startScale;
  };
  getScaleY = function() {
    var height;
    _targetInfo.height = height = $target.height();
    if (height < _startY) {
      return _startScale;
    }
    if (height > _endY) {
      return _endScale;
    }
    return (height - _startY) * (_endScale - _startScale) / (_endY - _startY) + _startScale;
  };
  setScaleInfo = function() {
    var scale, scaleX, scaleY;
    scale = null;
    scaleX = getScaleX();
    scaleY = getScaleY();
    switch (_mode) {
      case 'x':
        scale = scaleX;
        break;
      case 'y':
        scale = scaleY;
        break;
      case 'max':
        scale = caro.max([scaleX, scaleY]);
        break;
      case 'min':
        scale = caro.min([scaleX, scaleY]);
    }
    _infoObj.scaleX = scaleX;
    _infoObj.scaleY = scaleY;
    return _infoObj.scale = scale;
  };
  setTargetInfo = function() {
    var scale;
    scale = setScaleInfo();
    _selfInfo.newWidth = _selfInfo.width * scale;
    _selfInfo.newHeight = _selfInfo.height * scale;
  };

  /* 計算並執行 scale */
  $self.updateScale = function() {
    var scaleObj;
    setTargetInfo();
    if (_befScale && _befScale(_infoObj) === false) {
      return;
    }
    scaleObj = {
      onComplete: function() {
        _aftScale && _aftScale(_infoObj);
      }
    };
    if (_isScaleX) {
      scaleObj.width = _selfInfo.newWidth;
    }
    if (_isScaleY) {
      scaleObj.height = _selfInfo.newHeight;
    }
    tm.to($self, _duration, scaleObj);
    return $self;
  };

  /* 執行 scale */
  $self.bindScale = function() {
    $target.off(_triggerName).on(_triggerName, function() {
      return $self.updateScale();
    });
    return $self;
  };

  /* 不綁定 scale */
  $self.unbindScale = function() {
    $self.off(_triggerName);
    return $self;
  };

  /* 設定 width 起始值 */
  $self.setBasicWidth = function(width) {
    _selfInfo.width = width;
    return $self;
  };

  /* 設定 height 起始值 */
  $self.setBasicHeight = function(height) {
    _selfInfo.height = height;
    return $self;
  };
  $self.bindScale();
  $self.updateScale();
  return $self;
});
