
/* 客製化頁面跳轉效果 */
cf.regServ('routeAnimate', function(cf) {
  var _routeOpt, _routeType, _router, goPageFn, self, tl, tm;
  self = {};
  tm = cf.require('TweenMax');
  tl = cf.require('TimelineMax');
  _router = cf.router;
  _routeType = '';
  _routeOpt = '';
  self.left = function(opt) {
    if (opt == null) {
      opt = {};
    }
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
  self.right = function(opt) {
    if (opt == null) {
      opt = {};
    }
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
  self.scale = function(opt) {
    if (opt == null) {
      opt = {};
    }
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
  self.fade = function(opt) {
    if (opt == null) {
      opt = {};
    }
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
  self.rotateY = function(opt) {
    if (opt == null) {
      opt = {};
    }
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
    _routeType = type;
    return _routeOpt = opt;
  };

  /* 更新 router.goPage */
  goPageFn = _router.goPage;

  /* 頁面, 換頁方式, 參數 */
  _router.goPage = function(page, type, opt) {
    if (type == null) {
      type = _routeType;
    }
    if (opt == null) {
      opt = _routeOpt;
    }
    if (type === '') {
      _router.transitionFn = null;
    }
    if (type) {
      self[type](opt);
    }
    return goPageFn(page);
  };
  return self;
});
