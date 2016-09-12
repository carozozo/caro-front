
/*
計算滑鼠和基準點的距離，同步移動 DOM
Depend on gsap
 */
cf.regModule('cfSyncMove', function(opt) {
  var $document, $self, $window, _aftMove, _baseX, _baseY, _befMove, _proportionX, _proportionY, _rangeX, _rangeY, _reverseX, _reverseY, _stopMove, _triggerName1, _triggerName2, tm, triggerFn;
  if (opt == null) {
    opt = {};
  }
  $self = this;
  $window = cf.$window;
  $document = cf.$document;
  tm = cf.require('TweenMax');

  /* x 軸基準坐標, 設為 false 則不同步移動 x */
  _baseX = opt.baseX !== void 0 ? opt.baseX : function() {
    return $window.width() / 2;
  };

  /* y 軸基準坐標, 設為 false 則不同步移動 y */
  _baseY = opt.baseY !== void 0 ? opt.baseY : function() {
    return $window.height() / 2;
  };

  /* x 移動比例 */
  _proportionX = opt.proportionX || .05;

  /* y 移動比例 */
  _proportionY = opt.proportionY || .05;

  /* x 最大移動範圍, 未設置代表不限制 */
  _rangeX = opt.rangeX;

  /* y 最大移動範圍, 未設置代表不限制 */
  _rangeY = opt.rangeY;

  /* x 是否和滑鼠方向一樣 */
  _reverseX = opt.reverseX === false ? false : true;

  /* y 是否和滑鼠方向一樣 */
  _reverseY = opt.reverseY === false ? false : true;

  /* 移動之前的 cb, 如果 return false 則不移動 */
  _befMove = opt.befMove;

  /* 移動之後的 cb */
  _aftMove = opt.aftMove;

  /* 停止移動之後的 cb */
  _stopMove = opt.stopMove;
  _triggerName1 = 'mousemove.cfSyncMove';
  _triggerName2 = 'touchmove.cfSyncMove';
  triggerFn = function(e) {
    var baseX, baseY, infoObj, mouseX, mouseY, moveObj, moveX, moveY, targetMoveX, targetMoveY, targetTouches;
    targetTouches = e.originalEvent && e.originalEvent.targetTouches || [{}];
    mouseX = e.pageX || targetTouches.pageX;
    mouseY = e.pageY || targetTouches.pageY;
    infoObj = {
      event: e,
      moveX: 0,
      moveY: 0,
      mouseX: mouseX,
      mouseY: mouseY,
      baseX: null,
      baseY: null,
      $self: $self
    };
    moveObj = {
      x: null,
      y: null,
      onComplete: function() {
        _aftMove && _aftMove(infoObj);
      }
    };
    baseX = caro.isFunction(_baseX) ? _baseX() : _baseX;
    if (caro.isNumber(baseX)) {
      moveX = mouseX - baseX;
      targetMoveX = moveX * _proportionX;
      if (_rangeX) {
        if (targetMoveX > _rangeX) {
          targetMoveX = _rangeX;
        } else if (targetMoveX < -_rangeX) {
          targetMoveX = -_rangeX;
        }
      }
      if (_reverseX) {
        targetMoveX = -targetMoveX;
      }
      infoObj.moveX = moveObj.x = targetMoveX || 0;
      infoObj.baseX = baseX;
    }
    baseY = caro.isFunction(_baseY) ? _baseY() : _baseY;
    if (caro.isNumber(baseY)) {
      moveY = mouseY - baseY;
      targetMoveY = moveY * _proportionY;
      if (_rangeY) {
        if (targetMoveY > _rangeY) {
          targetMoveY = _rangeY;
        } else if (targetMoveY < -_rangeY) {
          targetMoveY = -_rangeY;
        }
      }
      if (_reverseY) {
        targetMoveY = -targetMoveY;
      }
      infoObj.moveY = moveObj.y = targetMoveY || 0;
      infoObj.baseY = baseY;
    }
    if (_befMove && _befMove(infoObj) === false) {
      return;
    }
    tm.to($self, 1, moveObj);
    clearTimeout($self.data("syncMoveCheck"));
    $self.data("syncMoveCheck", setTimeout(function() {
      _stopMove && _stopMove();
    }, 250));
  };

  /* 開始監聽滑鼠並同步移動 */
  $self.startSyncMove = function() {
    $document.on(_triggerName1, triggerFn);
    $document.on(_triggerName2, triggerFn);
    return $self;
  };

  /* 停止監聽滑鼠 */
  $self.stopSyncMove = function() {
    $document.off(_triggerName1);
    $document.off(_triggerName2);
    return $self;
  };
  return $self;
});
