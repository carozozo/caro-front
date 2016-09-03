
/*
輪流切換 DOM 內容, 預設顯示第一個, 其他透明度設為 0
Depend on gsap
 */
cf.regModule('cfSwitchShow', function($domList, opt) {
  var $self, _aftSwitch, _befSwitch, _currentIndex, _defType, _distance, _duration, switchShow, tl;
  if (opt == null) {
    opt = {};
  }

  /* $domList: 要顯示的 dom 列表, e.g. [$('#dom1'), $('#dom2')] */
  $self = this;
  tl = new TimelineLite();

  /* defType: 預設顯示方式 [fade/up/down/lef/right/''] */
  _defType = opt.defType || 'fade';

  /* 預設切換時間 */
  _duration = opt.duration || 0.5;

  /* 預設移動距離 */
  _distance = opt.distance || 30;

  /* 切換之前呼叫的 cb(), return false 則不切換 */
  _befSwitch = opt.befSwitch;

  /* 切換之後呼叫的 cb() */
  _aftSwitch = opt.aftSwitch;

  /* 目前所在的 index */
  _currentIndex = 0;
  cf.forEach($domList, function($dom, i) {
    if (!i) {
      return;
    }
    tl.set($dom, {
      opacity: 0
    });
  });
  switchShow = function(i, type, opt) {
    var $currentDom, $targetDom, aftSwitch, befSwitch, callAftShow, distance, duration;
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
    befSwitch = opt.befSwitch || _befSwitch;

    /* 切換後的 cb */
    aftSwitch = opt.aftSwitch || _aftSwitch;
    callAftShow = function() {
      tl.set([$currentDom, $targetDom], {
        x: 0,
        y: 0
      });
      aftSwitch && aftSwitch(_currentIndex, i);
      _currentIndex = i;
    };
    $currentDom = $domList[_currentIndex];
    $targetDom = $domList[i];
    if (befSwitch && befSwitch(_currentIndex, i) === false) {
      return;
    }
    switch (type) {
      case 'fade':
        tl.fromTo($currentDom, duration, {
          opacity: 1
        }, {
          opacity: 0
        });
        tl.fromTo($targetDom, duration, {
          opacity: 0
        }, {
          opacity: 1,
          onComplete: callAftShow
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
        tl.set($currentDom, {
          opacity: 0
        });
        tl.set($targetDom, {
          opacity: 1,
          onComplete: callAftShow
        });
    }
    return $self;
  };

  /* index: 要顯示的目標, type: 指定顯示方式 [fade/up/down/lef/right/''] */
  $self.switchDom = function(index, type, opt) {
    var targetIndex;
    targetIndex = index;
    return switchShow(targetIndex, type, opt);
  };

  /* 顯示下一個內容 */
  $self.showNext = function(type, opt) {
    var targetIndex;
    targetIndex = _currentIndex + 1;
    if (targetIndex > $domList.length - 1) {
      targetIndex = 0;
    }
    return switchShow(targetIndex, type, opt);
  };

  /* 顯示上一個內容 */
  $self.showPrev = function(type, opt) {
    var targetIndex;
    targetIndex = _currentIndex - 1;
    if (targetIndex < 0) {
      targetIndex = $domList.length - 1;
    }
    return switchShow(targetIndex, type, opt);
  };
  $domList[_currentIndex];
  return $self;
});
