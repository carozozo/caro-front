
/*
客製化頁面跳轉效果
 */
cf.regLib('routeAnimate', function(cf) {
  var self, tl, tm;
  self = {};
  tm = cf.require('TweenMax');
  tl = cf.require('TimelineMax');

  /* 左移換場效果 */
  self.left = function(opt) {
    var _router;
    if (opt == null) {
      opt = {};
    }
    _router = cf.router;
    return _router._transitionFn = function(cf, $nowPage, $nextPage, done) {
      var duration, position;
      _router.$container.css({
        overflow: 'hidden'
      });
      duration = opt.duration || .8;
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
          done();
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
    return _router._transitionFn = function(cf, $nowPage, $nextPage, done) {
      var duration, position;
      _router.$container.css({
        overflow: 'hidden'
      });
      duration = opt.duration || .8;
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
          done();
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
    return _router._transitionFn = function(cf, $nowPage, $nextPage, done) {
      var duration, tl1;
      duration = opt.duration || .8;
      duration = duration / 2;
      $nextPage.hide();
      tl1 = new tl();
      tl1.to($nowPage, duration, {
        scale: 0,
        opacity: 0,
        ease: Power0.easeNone,
        onComplete: function() {
          $nowPage.hide();
          $nextPage.show();
        }
      }).fromTo($nextPage, duration, {
        scale: 0,
        opacity: 0
      }, {
        scale: 1,
        opacity: 1,
        ease: Power0.easeNone,
        onComplete: function() {
          done();
          $nextPage.css({
            transform: ''
          });
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
    return _router._transitionFn = function(cf, $nowPage, $nextPage, done) {
      var duration, tl1;
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
          done();
        }
      });
    };
  };

  /* 清除換場效果 */
  self.clear = function() {
    cf.router._transitionFn = null;
  };
  return self;
});
