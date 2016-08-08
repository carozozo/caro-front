
/* 客製化頁面跳轉效果 */
cf.regLib('routeAnimate', function(cf) {
  var self, tl;
  self = {};
  tl = cf.require('TimelineMax');

  /* 左移換場效果 */
  self.left = function(opt) {
    var _router;
    if (opt == null) {
      opt = {};
    }
    _router = cf.router;
    return _router.transitionFn = function(cf, $nowPage, $nextPage, nowPageDone, done) {
      var duration, tl1;
      _router.blockGoPage();
      duration = opt.duration || .8;
      duration = duration / 2;
      tl1 = new tl();
      tl1.to($nowPage, duration, {
        position: 'absolute',
        'margin-left': '-100%',
        ease: Power0.easeNone,
        onComplete: function() {
          nowPageDone();
        }
      }).fromTo($nextPage, duration, {
        'margin-left': '100%'
      }, {
        'margin-left': 0,
        delay: .1,
        ease: Power0.easeNone,
        onComplete: function() {
          _router.approveGoPage();
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
    return _router.transitionFn = function(cf, $nowPage, $nextPage, nowPageDone, done) {
      var duration, tl1;
      _router.blockGoPage();
      duration = opt.duration || .8;
      duration = duration / 2;
      tl1 = new tl();
      tl1.to($nowPage, duration, {
        position: 'absolute',
        'margin-left': '100%',
        ease: Power0.easeNone,
        onComplete: function() {
          nowPageDone();
        }
      }).fromTo($nextPage, duration, {
        'margin-left': '-100%'
      }, {
        'margin-left': 0,
        ease: Power0.easeNone,
        onComplete: function() {
          _router.approveGoPage();
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
    return _router.transitionFn = function(cf, $nowPage, $nextPage, nowPageDone, done) {
      var duration, tl1;
      _router.blockGoPage();
      duration = opt.duration || .8;
      duration = duration / 2;
      tl1 = new tl();
      tl1.to($nowPage, duration, {
        scale: 0,
        opacity: 0,
        ease: Power0.easeNone,
        onComplete: function() {
          nowPageDone();
        }
      }).fromTo($nextPage, duration, {
        scale: 0,
        opacity: 0
      }, {
        scale: 1,
        opacity: 1,
        ease: Power0.easeNone,
        onComplete: function() {
          $nextPage.css('transform', '');
          _router.approveGoPage();
          return done();
        }
      }, '-=' + duration / 2);
    };
  };

  /* fade 換場效果 */
  self.fade = function(opt) {
    var _router;
    if (opt == null) {
      opt = {};
    }
    _router = cf.router;
    return _router.transitionFn = function(cf, $nowPage, $nextPage, nowPageDone, done) {
      var duration, tl1;
      _router.blockGoPage();
      duration = opt.duration || .8;
      duration = duration / 2;
      tl1 = new tl();
      tl1.to($nowPage, duration, {
        opacity: 0,
        onComplete: function() {
          nowPageDone();
        }
      }).fromTo($nextPage, duration, {
        opacity: 0
      }, {
        opacity: 1,
        onComplete: function() {
          _router.approveGoPage();
          done();
        }
      });
    };
  };

  /* 清除換場效果 */
  self.clear = function() {
    cf.router.transitionFn = null;
  };
  return self;
});
