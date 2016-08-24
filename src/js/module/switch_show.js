
/*
輪流顯示 DOM, 預設顯示第一個
 */
cf.regModule('cfSwitchShow', function($domList, opt) {
  var $self, _aftShow, _befShow, _currentIndex, _defType, _distance, _duration, caro, cf, switchShow, tl;
  if (opt == null) {
    opt = {};
  }

  /* $domList: 要顯示的 dom 列表, e.g. [$('#dom1'), $('#dom2')] */
  $self = this;
  cf = $self.cf;
  caro = cf.require('caro');
  tl = new TimelineLite();

  /* defType: 預設顯示方式 [fade/up/down/lef/right/''] */
  _defType = opt.defType || 'fade';

  /* 預設移動時間 */
  _duration = opt.duration || 0.5;

  /* 預設移動距離 */
  _distance = opt.distance || 30;

  /* 切換之前呼叫的 cb(), return false 則不切換 */
  _befShow = opt.befShow;

  /* 切換之後呼叫的 cb() */
  _aftShow = opt.aftShow;

  /* 目前所在的 index */
  _currentIndex = 0;
  caro.forEach($domList, function($dom) {
    $dom.hide();
  });
  switchShow = function(i, type, opt) {
    var $currentDom, $targetDom, aftShow, befShow, callAftShow, distance, duration;
    if (opt == null) {
      opt = {};
    }
    if (tl.isActive()) {
      return;
    }

    /* 顯示方式 */
    type = type || _defType || 'fade';

    /* 移動時間 */
    duration = opt.duration || _duration;

    /* 移動距離 */
    distance = opt.distance || _distance;

    /* 切換前的 cb, return false 則不切換 */
    befShow = opt.befShow || _befShow;

    /* 切換後的 cb */
    aftShow = opt.aftShow || _aftShow;
    callAftShow = function() {
      aftShow && aftShow(_currentIndex, i);
      _currentIndex = i;
    };
    $currentDom = $domList[_currentIndex];
    $targetDom = $domList[i];
    if (befShow && befShow(_currentIndex, i) === false) {
      return;
    }
    switch (type) {
      case 'fade':
        $currentDom.fadeOut(function() {
          $targetDom.fadeIn(callAftShow);
        });
        break;
      case 'up':
        $targetDom.show();
        tl.fromTo($currentDom, duration, {
          opacity: 1
        }, {
          opacity: 0,
          y: -distance
        });
        tl.fromTo($targetDom, duration, {
          opacity: 0,
          y: distance
        }, {
          opacity: 1,
          y: 0,
          onComplete: callAftShow
        });
        break;
      case 'down':
        $targetDom.show();
        tl.fromTo($currentDom, duration, {
          opacity: 1
        }, {
          opacity: 0,
          y: distance
        });
        tl.fromTo($targetDom, duration, {
          opacity: 0,
          y: -distance
        }, {
          opacity: 1,
          y: 0,
          onComplete: callAftShow
        });
        break;
      case 'left':
        $targetDom.show();
        tl.fromTo($currentDom, duration, {
          opacity: 1
        }, {
          opacity: 0,
          x: -distance
        });
        tl.fromTo($targetDom, duration, {
          opacity: 0,
          x: distance
        }, {
          opacity: 1,
          x: 0,
          onComplete: callAftShow
        });
        break;
      case 'right':
        $targetDom.show();
        tl.fromTo($currentDom, duration, {
          opacity: 1
        }, {
          opacity: 0,
          x: distance
        });
        tl.fromTo($targetDom, duration, {
          opacity: 0,
          x: -distance
        }, {
          opacity: 1,
          x: 0,
          onComplete: callAftShow
        });
        break;
      case 'normal':
        tl.set([$currentDom, $targetDom], {
          opacity: 1
        });
        $currentDom.hide();
        $targetDom.show();
        setTimeout(callAftShow);
    }
    return $self;
  };

  /* index: 要顯示的目標, type: 指定顯示方式 [fade/up/down/lef/right/''] */
  $self.showDom = function(index, type, opt) {
    var targetIndex;
    targetIndex = index;
    return switchShow(targetIndex, type, opt);
  };

  /* 顯示下一個內容 */
  $self.nextShow = function(type, opt) {
    var targetIndex;
    if (opt == null) {
      opt = {};
    }
    targetIndex = _currentIndex + 1;
    if (targetIndex > $domList.length - 1) {
      targetIndex = 0;
    }
    return switchShow(targetIndex, type, opt);
  };

  /* 顯示上一個內容 */
  $self.prevShow = function(type, opt) {
    var targetIndex;
    if (opt == null) {
      opt = {};
    }
    targetIndex = _currentIndex - 1;
    if (targetIndex < 0) {
      targetIndex = $domList.length - 1;
    }
    return switchShow(targetIndex, type, opt);
  };
  $domList[_currentIndex].show();
  return $self;
});
