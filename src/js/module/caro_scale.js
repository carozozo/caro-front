
/* 隨目標縮放自己的大小 */
cf.regModule('caroScale', function(opt) {
  var $self, $target, _infoObj, _selfInfo, _targetInfo, _triggerName, caro, cf, getScaleX, getScaleY, oAftScale, oBefScale, oDuration, oEndScale, oEndX, oEndY, oIsScaleX, oIsScaleY, oMode, oStartScale, oStartX, oStartY, selfHeight, selfWidth, setScaleInfo, setTargetInfo, tm;
  if (opt == null) {
    opt = {};
  }
  $self = this;
  cf = $self.cf;
  caro = cf.require('caro');
  tm = cf.require('TweenMax');
  $target = opt.$target || cf.$window;

  /* 綁定 resize 的 name space */
  _triggerName = opt.triggerName ? 'resize.caroAutoScale.' + opt.triggerName : 'resize.caroAutoScale';

  /* 指定觸發縮放的 $target 寬度範圍 */
  oStartX = caro.isNumber(opt.startX) ? opt.startX : 1100;
  oEndX = caro.isNumber(opt.endX) ? opt.endX : 1920;

  /* 指定觸發縮放的 $target 高度範圍 */
  oStartY = caro.isNumber(opt.startY) ? opt.startY : 600;
  oEndY = caro.isNumber(opt.endY) ? opt.endY : 1080;

  /* 指定縮放範圍 */
  oStartScale = opt.startScale || 1;
  oEndScale = opt.endScale || 1.2;

  /* 縮放基準, min: scaleX scaleY 取最小, max: scaleX scaleY 取最大, x: scaleX, y: scaleY */
  oMode = opt.mode || 'x';

  /* 是否縮放 $self 的寬 */
  oIsScaleX = opt.isScaleX === false ? false : true;

  /* 是否縮放 $self 的高 */
  oIsScaleY = opt.isScaleY;

  /* scale 時間, 單位為秒 */
  oDuration = opt.duration || 0.3;

  /* scale 之前的 cb, 回傳 false 會停止 scale */
  oBefScale = opt.befScale;

  /* 用來取得 scale 之後的 css 資訊 */
  oAftScale = opt.aftScale;
  selfWidth = $self.width();
  selfHeight = $self.height();
  _selfInfo = {
    width: selfWidth,
    height: selfHeight,
    newWidth: selfWidth,
    newHeight: selfHeight
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
    if (width < oStartX) {
      return oStartScale;
    }
    if (width > oEndX) {
      return oEndScale;
    }
    return (width - oStartX) * (oEndScale - oStartScale) / (oEndX - oStartX) + oStartScale;
  };
  getScaleY = function() {
    var height;
    _targetInfo.height = height = $target.height();
    if (height < oStartY) {
      return oStartScale;
    }
    if (height > oEndY) {
      return oEndScale;
    }
    return (height - oStartY) * (oEndScale - oStartScale) / (oEndY - oStartY) + oStartScale;
  };
  setScaleInfo = function() {
    var scale, scaleX, scaleY;
    scale = null;
    scaleX = getScaleX();
    scaleY = getScaleY();
    switch (oMode) {
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
  $self.updateScale = function() {
    var scaleObj;
    setTargetInfo();
    if (oBefScale && oBefScale(_infoObj) === false) {
      return;
    }
    scaleObj = {
      onComplete: function() {
        oAftScale && oAftScale(_infoObj);
      }
    };
    if (oIsScaleX) {
      scaleObj.width = _selfInfo.newWidth;
    }
    if (oIsScaleY) {
      scaleObj.height = _selfInfo.newHeight;
    }
    tm.to($self, oDuration, scaleObj);
    return $self;
  };
  $self.bindScale = function() {
    $target.off(_triggerName).on(_triggerName, function() {
      return $self.updateScale();
    });
    return $self;
  };
  $self.unbindScale = function() {
    $self.off(_triggerName);
    return $self;
  };
  $self.bindScale();
  $self.updateScale();
  return $self;
});
