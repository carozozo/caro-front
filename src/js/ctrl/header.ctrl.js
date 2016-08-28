
/* 有搭配 .html 的 ctrl, 觸發時會讀取 template/ctrl/header.html 檔並寫入 template */
cf.regCtrl('header', function() {
  var $headerBtn, $headerTitle, $self, bgColorArr, cf, tl, tl1, tm;
  $self = this;
  cf = $self.cf;
  tl = cf.require('TimelineMax');
  tm = cf.require('TweenMax');
  bgColorArr = cf.data('bgColorArr');
  $self.dom(function($header) {
    return cf.router.regPrePage(function() {
      var color;
      color = caro.randomPick(bgColorArr);
      tm.to($header, 1, {
        backgroundColor: color
      });
    });
  });
  $headerTitle = $self.dom('#headerTitle').onClick(function() {
    cf.router.goPage('index');
  });
  $headerBtn = $self.dom('.headerBtn');
  tl1 = new tl();
  tl1.from($headerTitle, .5, {
    opacity: 0,
    y: -10,
    ease: Elastic.easeOut.config(1, 0.4),
    onComplete: function() {
      cf.router.approveGoPage();
      cf.router.goPage();
    }
  }).staggerFrom($headerBtn, .5, {
    opacity: 0,
    x: -50,
    ease: Back.easeOut.config(1)
  }, .2);
  return $self;
}, 'template/ctrl/header.html');

cf.regDocReady(function(cf) {
  var $;
  cf.router.blockGoPage();
  $ = cf.require('$');
  $('#header').header();
});
