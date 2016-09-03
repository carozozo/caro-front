
/*
客製化頁面跳轉效果
 */
cf.regLib('routeAnimate', function(cf) {
  var approveGo, self, tl, tm;
  self = {};
  tm = cf.require('TweenMax');
  tl = cf.require('TimelineMax');
  approveGo = function(router, done) {
    router.approveGoPage();
    done();
  };

  /* 左移換場效果 */
  self.left = function(opt) {
    var _router;
    if (opt == null) {
      opt = {};
    }
    _router = cf.router;
    _router._transitionFn = function(cf, $nowPage, $nextPage, done) {
      var duration, position;
      _router.blockGoPage();

      /* 換頁時間 */
      duration = opt.duration || .8;
      _router.$container.css({
        overflow: 'hidden'
      });
      duration = duration / 2;
      position = $nextPage.css('position');
      tm.to($nowPage, duration, {
        position: 'fixed',
        'margin-left': '-100%',
        ease: Power0.easeNone
      });
      tm.fromTo($nextPage, duration, {
        position: 'fixed',
        'margin-left': '100%'
      }, {
        'margin-left': 0,
        delay: .1,
        ease: Power0.easeNone,
        onComplete: function() {
          $nextPage.css({
            position: position,
            transform: ''
          });
          approveGo(_router, done);
        }
      });
    };
  };

  /* 右移換場效果 */
  self.right = function(opt) {
    var _router;
    if (opt == null) {
      opt = {};
    }
    _router = cf.router;
    _router._transitionFn = function(cf, $nowPage, $nextPage, done) {
      var duration, position;
      _router.blockGoPage();

      /* 換頁時間 */
      duration = opt.duration || .8;
      _router.$container.css({
        overflow: 'hidden'
      });
      duration = duration / 2;
      position = $nextPage.css('position');
      tm.to($nowPage, duration, {
        position: 'fixed',
        'margin-left': '100%',
        ease: Power0.easeNone
      });
      tm.fromTo($nextPage, duration, {
        position: 'fixed',
        'margin-left': '-100%'
      }, {
        'margin-left': 0,
        ease: Power0.easeNone,
        onComplete: function() {
          $nextPage.css({
            position: position,
            transform: ''
          });
          approveGo(_router, done);
        }
      });
    };
  };

  /* 縮放換場效果 */
  self.scale = function(opt) {
    var _router;
    if (opt == null) {
      opt = {};
    }
    _router = cf.router;
    _router._transitionFn = function(cf, $nowPage, $nextPage, done) {
      var duration, rotation, tl1;
      _router.blockGoPage();

      /* 換頁時間 */
      duration = opt.duration || .8;

      /* 旋轉角度 */
      rotation = opt.rotation || 0;
      duration = duration / 2;
      $nextPage.hide();
      tl1 = new tl();
      tl1.to($nowPage, duration, {
        scale: 0,
        opacity: 0,
        rotation: rotation,
        ease: Power0.easeNone,
        onComplete: function() {
          $nowPage.hide();
          $nextPage.show();
        }
      }).fromTo($nextPage, duration, {
        scale: 0,
        opacity: 0,
        rotation: rotation
      }, {
        scale: 1,
        opacity: 1,
        rotation: 0,
        ease: Power0.easeNone,
        onComplete: function() {
          $nextPage.css({
            transform: ''
          });
          approveGo(_router, done);
        }
      });
    };
  };

  /* fade 換場效果 */
  self.fade = function(opt) {
    var _router;
    if (opt == null) {
      opt = {};
    }
    _router = cf.router;
    _router._transitionFn = function(cf, $nowPage, $nextPage, done) {
      var duration, tl1;
      _router.blockGoPage();

      /* 換頁時間 */
      duration = opt.duration || .8;
      duration = duration / 2;
      $nextPage.hide();
      tl1 = new tl();
      tl1.to($nowPage, duration, {
        opacity: 0,
        onComplete: function() {
          $nowPage.hide();
          $nextPage.show();
        }
      }).fromTo($nextPage, duration, {
        opacity: 0
      }, {
        opacity: 1,
        onComplete: function() {
          approveGo(_router, done);
        }
      });
    };
  };

  /* slide 換場效果 */
  self.slide = function(opt) {
    var _router;
    if (opt == null) {
      opt = {};
    }
    _router = cf.router;
    _router._transitionFn = function(cf, $nowPage, $nextPage, done) {
      var duration;
      _router.blockGoPage();

      /* 換頁時間 */
      duration = opt.duration || .8;
      duration = duration / 2 * 1000;
      $nextPage.hide();
      $nowPage.slideUp(duration, function() {
        $nowPage.hide();
        $nextPage.slideDown(duration, function() {
          approveGo(_router, done);
        });
      });
    };
  };
  self.piece = function(opt) {
    var _router;
    if (opt == null) {
      opt = {};
    }
    _router = cf.router;
    _router._transitionFn = function(cf, $nowPage, $nextPage, done) {
      var count, duration, eachHeight, eachWidth, halfDuration, halfParticleX, halfParticleY, nowPageHeight, nowPageLeft, nowPageOffset, nowPagePosition, nowPageTop, nowPageWidth, particleAll, particleX, particleY, piecePosition;
      _router.blockGoPage();

      /* 換頁時間 */
      duration = opt.duration || .8;

      /* x 要切成幾等份 */
      particleX = opt.particleX || 3;

      /* y 要切成幾等份 */
      particleY = opt.particleY || 3;
      halfParticleX = particleX / 2;
      halfParticleY = particleY / 2;

      /* 全部切成幾等份 */
      particleAll = particleX * particleY;
      nowPagePosition = $nowPage.css('position');
      nowPageWidth = $nowPage.width();
      nowPageHeight = $nowPage.height();
      nowPageOffset = $nowPage.offset();
      nowPageLeft = nowPageOffset.left;
      nowPageTop = nowPageOffset.top;
      halfDuration = duration / 2;

      /* 每個等份的寬 */
      eachWidth = nowPageWidth / particleX;

      /* 每個等份的高 */
      eachHeight = nowPageHeight / particleY;
      piecePosition = nowPagePosition === 'fixed' ? 'fixed' : 'absolute';
      count = 0;
      $nextPage.hide();
      cf.loop(function(j) {
        cf.loop(function(i) {
          var $dom, animateObj, left, top;
          count++;
          left = nowPageLeft + (eachWidth * (i - 1));
          top = nowPageTop + (eachHeight * (j - 1));
          $dom = $('<div/>').css({
            position: piecePosition,
            width: eachWidth,
            height: eachHeight,
            overflow: 'hidden',
            left: left,
            top: top
          });
          $nowPage.after($dom);
          $nowPage.clone().css({
            position: 'absolute',
            visibility: 'visible',
            width: nowPageWidth,
            height: nowPageHeight,
            left: -(eachWidth * (i - 1)),
            top: -(eachHeight * (j - 1))
          }).appendTo($dom);
          animateObj = {
            onComplete: function() {
              if (count === particleAll) {
                $nextPage.fadeIn();
                approveGo(_router, done);
              }
              $dom.remove();
            }
          };

          /* 計算位移量 */
          animateObj.x = Math.floor(i - halfParticleX) * 20;
          animateObj.y = Math.floor(j - halfParticleY) * 20;
          tm.to($dom, duration, animateObj);
          tm.to($dom, halfDuration, {
            opacity: 0,
            delay: halfDuration
          }, animateObj);
        }, 1, particleX);
      }, 1, particleY);
      $nowPage.hide();
    };
  };

  /* 清除換場效果 */
  self.clear = function() {
    cf.router._transitionFn = null;
  };
  return self;
});
