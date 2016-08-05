
/* 一般的 ctrl */
cf.regCtrl('commonPage', function(opt) {
  var $list, $self, $subTitle, $title, cf, tl, tl1;
  if (opt == null) {
    opt = {};
  }
  $self = this;
  cf = $self.cf;
  tl = cf.require('TimelineMax');
  $title = $self.dom('.title');
  $subTitle = $self.dom('.subTitle');
  $list = $self.dom('.list');
  tl1 = new tl();
  tl1.from($title, .5, {
    opacity: 0,
    x: -50
  }).from($subTitle, .5, {
    opacity: 0,
    y: -50
  }, .3).staggerFrom($list, .5, {
    opacity: 0,
    x: -50
  }, .1);
  return $self;
});
