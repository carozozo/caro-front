
/*
計算滑鼠和基準點的距離，同步移動 DOM
 */
cf.regModule('cfSyncMove', function(nameSpace, opt) {
  var $document, $self, $window, _aftMove, _baseX, _baseY, _befMove, _proportionX, _proportionY, _rangeX, _rangeY, _reverseX, _reverseY, _stopMove, _triggerName1, _triggerName2, caro, cf, tm, triggerFn;
  if (opt == null) {
    opt = {};
  }

  /* nameSpace: 滑鼠移動的 name space 防止重複觸發 */
  $self = this;
  cf = $self.cf;
  $window = cf.$window;
  $document = cf.$document;
  caro = cf.require('caro');
  tm = cf.require('TweenMax');

  /* X軸基準坐標 */
  _baseX = opt.baseX !== void 0 ? opt.baseX : function() {
    return $window.width() / 2;
  };

  /* Y軸基準坐標 */
  _baseY = opt.baseY;

  /* X移動比例 */
  _proportionX = opt.proportionX || 1;

  /* Y移動比例 */
  _proportionY = opt.proportionY || 1;

  /* X最大移動範圍 */
  _rangeX = opt.rangeX || 10;

  /* Y最大移動範圍 */
  _rangeY = opt.rangeY || 10;

  /* x 是否和滑鼠方向一樣 */
  _reverseX = opt.reverseX === false ? opt.reverseX : true;

  /* y 是否和滑鼠方向一樣 */
  _reverseY = opt.reverseY === false ? opt.reverseY : true;

  /* 移動之前的 cb, 如果 return false 則不移動 */
  _befMove = opt.befMove;

  /* 移動之後的 cb */
  _aftMove = opt.aftMove;

  /* 停止移動之後的 cb */
  _stopMove = opt.stopMove;
  _triggerName1 = 'mousemove.cfSyncMove';
  _triggerName2 = 'touchmove.cfSyncMove';
  if (nameSpace) {
    _triggerName1 += '.' + nameSpace;
    _triggerName2 += '.' + nameSpace;
  }
  triggerFn = function(e) {
    var baseX, baseY, infoObj, mouseX, mouseY, moveObj, moveX, moveY, targetMoveX, targetMoveY, targetTouches;
    targetTouches = e.originalEvent && e.originalEvent.targetTouches || [{}];
    mouseX = e.pageX || targetTouches.pageX;
    mouseY = e.pageY || targetTouches.pageY;
    infoObj = {
      e: e,
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
        return _aftMove && _aftMove(infoObj);
      }
    };
    baseX = caro.isFunction(_baseX) ? _baseX() : _baseX;
    if (caro.isNumber(baseX)) {
      moveX = mouseX - baseX;
      targetMoveX = moveX * _proportionX;
      if (targetMoveX > _rangeX) {
        targetMoveX = _rangeX;
      } else if (targetMoveX < -_rangeX) {
        targetMoveX = -_rangeX;
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
      if (targetMoveY > _rangeY) {
        targetMoveY = _rangeY;
      } else if (targetMoveY < -_rangeY) {
        targetMoveY = -_rangeY;
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
    clearTimeout($self.data("syncMoveCheck." + nameSpace));
    $self.data("syncMoveCheck." + nameSpace, setTimeout(function() {
      return _stopMove && _stopMove();
    }, 250));
  };
  $document.on(_triggerName1, triggerFn);
  $document.on(_triggerName2, triggerFn);

  /* 停止監聽 mousemove */
  $self.stopSyncMove = function() {
    $document.off(_triggerName1);
    return $document.off(_triggerName2);
  };
  return $self;
});
