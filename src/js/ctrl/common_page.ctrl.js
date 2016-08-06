
/* 一般的 ctrl */
cf.regCtrl('commonPage', function() {
  var $content, $mainTitle, $self, cf, tl, tl1;
  $self = this;
  cf = $self.cf;
  tl = cf.require('TimelineMax');
  $mainTitle = $self.dom('.mainTitle');
  $content = $self.dom('.content');
  tl1 = new tl();
  tl1.from($mainTitle, .5, {
    opacity: 0,
    x: -50
  }, '-=0.3').from($mainTitle, .7, {
    width: 200
  }).from($content, .5, {
    opacity: 0
  }, '-=0.3');
  return $self;
});

cf.router.regAftPage(function() {
  cf.router.$page.commonPage();
});
