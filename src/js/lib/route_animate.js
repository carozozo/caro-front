
/*
客製化頁面跳轉效果
 */
cf.regLib('routeAnimate', function(cf) {
  var approveGo, caro, self, tl, tm;
  self = {};
  caro = cf.require('caro');
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
          _router.$container.css({
            overflow: ''
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
          _router.$container.css({
            overflow: ''
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
      var $pieceContainer, $pieceInnerContainer, count, duration, eachHeight, eachWidth, halfDuration, halfParticleX, halfParticleY, nowPageHeight, nowPageLeft, nowPageOffset, nowPagePosition, nowPageTop, nowPageWidth, particleAll, particleX, particleY;
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
      nowPageOffset = $nowPage.position();
      nowPageLeft = nowPageOffset.left;
      nowPageTop = nowPageOffset.top;
      halfDuration = duration / 2;

      /* 每個等份的寬 */
      eachWidth = nowPageWidth / particleX;

      /* 每個等份的高 */
      eachHeight = nowPageHeight / particleY;

      /* 外部切片的容器, 繼承 $nowPage 的 css position 屬性 */
      $pieceContainer = $('<div/>').css({
        position: $nowPage.css('position')
      }).insertAfter($nowPage);

      /* 內部切片容器, 協助切片定位 */
      $pieceInnerContainer = $('<div/>').css({
        position: 'relative'
      }).appendTo($pieceContainer);
      count = 0;
      $nextPage.hide();
      caro.loop(function(i) {
        caro.loop(function(j) {
          var $piece, pieceLeft, pieceTop;
          count++;
          pieceLeft = eachWidth * j;
          pieceTop = eachHeight * i;
          $piece = $('<div/>').addClass('piece').css({
            position: 'absolute',
            width: eachWidth,
            height: eachHeight,
            overflow: 'hidden',
            left: pieceLeft,
            top: pieceTop
          }).appendTo($pieceInnerContainer);
          $nowPage.clone().appendTo($piece).css({
            position: 'absolute',
            visibility: 'visible',
            margin: 0,
            padding: 0,
            width: nowPageWidth,
            height: nowPageHeight,
            left: -pieceLeft,
            top: -pieceTop
          });
          tm.to($piece, duration, {
            x: Math.floor(j - halfParticleX) * 20,
            y: Math.floor(i - halfParticleY) * 20,
            opacity: 0,
            onComplete: function() {
              if (count !== particleAll) {
                return;
              }
              $nextPage.fadeIn();
              $pieceInnerContainer.remove();
              approveGo(_router, done);
            }
          });
        }, 0, particleX - 1);
      }, 0, particleY - 1);
      $nowPage.hide();
    };
  };

  /* 清除換場效果 */
  self.clear = function() {
    cf.router._transitionFn = null;
  };
  return self;
});
