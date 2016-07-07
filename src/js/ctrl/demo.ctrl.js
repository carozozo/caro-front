
/* 一般 ctrl */
cf.regCtrl('demoCtrl', (function(opt) {
  var $self, cf;
  if (opt == null) {
    opt = {};
  }
  $self = this;
  cf = $self.cf;
  return $self;
}));


/* 有搭配 .html 的 ctrl */

cf.regCtrl('demo2Ctrl', (function(opt) {
  var $self, cf;
  if (opt == null) {
    opt = {};
  }
  $self = this;
  cf = $self.cf;
  return $self;
}), 'demo.ctrl');
