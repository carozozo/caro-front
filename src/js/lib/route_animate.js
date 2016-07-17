
/* 客製化頁面跳轉效果 */
cf.regLib('routeAnimate', function(cf) {
  var self, tl, tm;
  self = {
    routeType: '',
    routeOpt: ''
  };
  tm = cf.require('TweenMax');
  tl = cf.require('TimelineMax');

  /* 當下頁面往左邊出場, 下個頁面入場 */
  self.left = function(opt) {
    var _router;
    if (opt == null) {
      opt = {};
    }
    _router = cf.router;
    return _router.transitionFn = function(cf, $nowPage, $nextPage, done) {
      var duration;
      _router.blockGoPage();
      duration = opt.duration || 0.8;
      if ($nowPage) {
        tm.to($nowPage, duration, {
          'margin-left': '-100%'
        });
      }
      return tm.fromTo($nextPage, duration, {
        'margin-left': '100%'
      }, {
        'margin-left': 0,
        onComplete: function() {
          _router.approveGoPage();
          return done();
        }
      });
    };
  };

  /* 當下頁面往右邊出場, 下個頁面入場 */
  self.right = function(opt) {
    var _router;
    if (opt == null) {
      opt = {};
    }
    _router = cf.router;
    return _router.transitionFn = function(cf, $nowPage, $nextPage, done) {
      var duration;
      _router.blockGoPage();
      duration = opt.duration || 0.8;
      if ($nowPage) {
        tm.to($nowPage, duration, {
          'margin-left': '100%'
        });
      }
      return tm.fromTo($nextPage, duration, {
        'margin-left': '-100%'
      }, {
        'margin-left': 0,
        onComplete: function() {
          _router.approveGoPage();
          return done();
        }
      });
    };
  };

  /* 縮放入場效果 */
  self.scale = function(opt) {
    var _router;
    if (opt == null) {
      opt = {};
    }
    _router = cf.router;
    return _router.transitionFn = function(cf, $nowPage, $nextPage, done) {
      var duration, tl1;
      _router.blockGoPage();
      duration = opt.duration || 0.4;
      tl1 = new tl();
      tl1.set($nextPage, {
        opacity: 0
      });
      if ($nowPage) {
        $nowPage.hide();
      }
      return tl1.fromTo($nextPage, duration, {
        scale: 0.1
      }, {
        scale: 1,
        opacity: 1,
        onComplete: function() {
          $nextPage.css('transform', '');
          _router.approveGoPage();
          return done();
        }
      }, '-=' + duration / 2);
    };
  };

  /* fade 入場效果 */
  self.fade = function(opt) {
    var _router;
    if (opt == null) {
      opt = {};
    }
    _router = cf.router;
    return _router.transitionFn = function(cf, $nowPage, $nextPage, done) {
      var duration, tl1;
      _router.blockGoPage();
      duration = opt.duration || 0.4;
      tl1 = new tl();
      tm.set($nextPage, {
        opacity: 0
      });
      if ($nowPage) {
        tl1.to($nowPage, duration, {
          opacity: 0
        });
      }
      return tl1.to($nextPage, duration, {
        opacity: 1,
        onComplete: function() {
          _router.approveGoPage();
          return done();
        }
      });
    };
  };

  /* 3D Y 軸旋轉效果 */
  self.rotateY = function(opt) {
    var _router;
    if (opt == null) {
      opt = {};
    }
    _router = cf.router;
    return _router.transitionFn = function(cf, $nowPage, $nextPage, done) {
      var duration, originPosition, perspective, tl1;
      _router.blockGoPage();
      duration = opt.duration || 0.4;
      perspective = opt.perspective || 1000;
      tl1 = new tl();
      if ($nowPage) {
        $nowPage.css({
          position: 'absolute'
        });
        tl1.fromTo($nowPage, duration, {
          rotationY: 0,
          transformPerspective: perspective
        }, {
          top: 30,
          scale: 0.9,
          rotationY: 90
        });
      }
      originPosition = $nextPage.css('position');
      $nextPage.css({
        position: 'absolute'
      });
      return tl1.fromTo($nextPage, duration, {
        top: 30,
        scale: 0.9,
        rotationY: 270,
        transformPerspective: perspective
      }, {
        top: 0,
        scale: 1,
        rotationY: 360,
        onComplete: function() {
          _router.approveGoPage();
          $nextPage.css({
            position: originPosition
          });
          $nextPage.css('transform', '');
          return done();
        }
      });
    };
  };

  /* 指定預設換頁方式 */
  self.setRouteType = function(type, opt) {
    self.routeType = type;
    return self.routeOpt = opt;
  };
  return self;
});

cf.regDocReady('routeAnimate', function(cf) {

  /* 更新 router.goPage */
  var _routeAnimate, _router, goPageFn;
  _router = cf.router;
  _routeAnimate = cf.routeAnimate;
  goPageFn = _router.goPage;

  /* 頁面, 換頁方式, 參數 */
  return _router.goPage = function(page, type, opt) {
    if (type == null) {
      type = _routeAnimate.routeType;
    }
    if (opt == null) {
      opt = _routeAnimate.routeOpt;
    }
    if (type === '') {
      _router.transitionFn = null;
    }
    if (type) {
      _routeAnimate[type](opt);
    }
    return goPageFn(page);
  };
});
