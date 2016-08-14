
/* 一般的 ctrl */
cf.regCtrl('commonPage', function() {
  var $, $codeTargetArr, $content, $mainTitle, $self, cf, titleClassArr, tl, tl1;
  $self = this;
  cf = $self.cf;
  $ = cf.require('$');
  tl = cf.require('TimelineMax');
  $mainTitle = $self.dom('.mainTitle');
  $content = $self.dom('.content');
  tl1 = new tl();
  tl1.from($mainTitle, .5, {
    opacity: 0,
    x: -50
  }, '-=0.3').from($mainTitle, .7, {
    width: 200,
    onComplete: function() {
      $mainTitle.css({
        width: '100%'
      });
    }
  }).from($content, .5, {
    opacity: 0
  }, '-=0.3');
  titleClassArr = ['title', 'subTitle', 'subTitle2', 'subTitle3'];
  caro.forEach(titleClassArr, function(className) {
    $self.dom('.' + className).mapDom(function($class) {
      var $span, html;
      $span = $('<span>').addClass(className);
      html = $class.html();
      $class.removeClass(className).html($span.html(html));
    });
  });
  $codeTargetArr = $self.dom('.codeTarget').mapDom(function($codeTarget) {
    $codeTarget.addClass('block').cfModal();
  });
  $self.dom('.codeLink').eachDom(function($link, i) {
    var $span, html;
    $span = $('<span>').dom().aClass('link');
    html = $link.html();
    $link.removeClass('link').html($span.html(html));
    $span.onClick(function() {
      $codeTargetArr[i].showModal();
    });
  });
  $self.dom('.title').eachDom((function($title) {
    var $subContents;
    $subContents = $title.parents('.content').find('.subContent');
    $title.onClick(function() {
      $subContents.slideToggle();
    });
  }));
  return $self;
});

cf.router.regAftPage(function() {
  cf.router.$page.commonPage();
});
