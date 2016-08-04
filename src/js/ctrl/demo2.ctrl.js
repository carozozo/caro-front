
/* 一般的 ctrl */
cf.regCtrl('demo2Ctrl', function(opt) {
  var $self, $window, cf, tm;
  if (opt == null) {
    opt = {};
  }
  $self = this;
  cf = $self.cf;
  $window = cf.$window;
  tm = cf.require('TweenMax');
  $self.onClick(function() {
    tm.to($self, .5, {
      opacity: 0,
      x: $window.width(),
      onComplete: function() {
        tm.set($self, {
          opacity: 1,
          x: 0
        });
      }
    });
  });
  return $self;
});
