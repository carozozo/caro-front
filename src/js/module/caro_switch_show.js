
/*
輪流顯示 DOM, 預設顯示第一個
$domList: 要顯示的 dom 列表
e.g. $('.domList')
e.g. [$('#dom1'), $('#dom2')]
defType: 預設顯示方式 [fade/up/down/lef/right/'']
 */
cf.regModule('caroSwitchShow', function($domList, defType) {
  var $self, caro, cf, currentIndex, switchShow, targetIndex, tl;
  $self = this;
  cf = $self.cf;
  caro = cf.require('caro');
  tl = new TimelineLite();
  defType = defType || 'fade';
  currentIndex = 0;
  targetIndex = 0;
  $domList = cf.unit.coverDomList($domList, function($dom) {
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
    type = type || defType || 'fade';
    duration = opt.duration || 0.5;
    distance = opt.distance || 30;
    befShow = opt.befShow;
    aftShow = opt.aftShow;
    callAftShow = function() {
      aftShow && aftShow(i);
    };

    /* 舊瀏覽器只支援 [fade/null] */
    if (cf.isBefIe8) {
      type = (type === 'fade') || (!type) ? type : 'fade';
    }
    $currentDom = $domList[currentIndex];
    $targetDom = $domList[i];
    currentIndex = i;
    befShow && befShow(i);
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

  /* opt.duration: 移動時間, opt.distance: 移動距離 */
  $self.showDom = function(index, type, opt) {
    targetIndex = index;
    return switchShow(targetIndex, type, opt);
  };

  /* 顯示下一個內容 */
  $self.next = function(type, opt) {
    if (opt == null) {
      opt = {};
    }
    targetIndex = currentIndex + 1;
    if (targetIndex > $domList.length - 1) {
      targetIndex = 0;
    }
    return switchShow(targetIndex, type, opt);
  };

  /* 顯示上一個內容 */
  $self.prev = function(type, opt) {
    if (opt == null) {
      opt = {};
    }
    targetIndex = currentIndex - 1;
    if (targetIndex < 0) {
      targetIndex = $domList.length - 1;
    }
    return switchShow(targetIndex, type, opt);
  };
  $domList[currentIndex].show();
  return $self;
});
