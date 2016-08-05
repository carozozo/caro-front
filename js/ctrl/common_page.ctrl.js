
/* 一般的 ctrl */
cf.regCtrl('commonPage', function(opt) {
  var $mainTitle, $self, $subContent, $title, cf, tl, tl1;
  if (opt == null) {
    opt = {};
  }
  $self = this;
  cf = $self.cf;
  tl = cf.require('TimelineMax');
  $mainTitle = $self.dom('.mainTitle');
  $title = $self.dom('.title');
  $subContent = $self.dom('.subContent');
  tl1 = new tl();
  tl1.from($mainTitle, .5, {
    opacity: 0,
    x: -50
  }).from([$title, $subContent], .5, {
    opacity: 0
  });
  return $self;
});
