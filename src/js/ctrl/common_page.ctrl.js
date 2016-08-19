
/* 一般的 ctrl */
cf.regCtrl('commonPage', function() {
  var $, $codeTargetArr, $mainTitle, $self, $title, cf, subTitleClassArr, tl, tl1;
  $self = this;
  cf = $self.cf;
  $ = cf.require('$');
  tl = cf.require('TimelineMax');
  $mainTitle = $self.dom('.mainTitle');
  subTitleClassArr = ['subTitle1', 'subTitle2', 'subTitle3', 'subTitle4', 'subTitle5'];
  caro.forEach(subTitleClassArr, function(className) {
    $self.dom('.' + className).mapDom(function($subTitle) {
      var $span, html;
      $span = $('<span>').addClass(className);
      html = $subTitle.html();
      $subTitle.removeClass(className).css({
        'margin-top': 5
      }).html($span.html(html));
      $subTitle.next('div').addClass('subContent');
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
  $title = $self.dom('.title').eachDom((function($title, i) {
    var $subContents, colorIndex;
    $title.next('div').addClass('subContent');
    $subContents = $title.parents('.content').find('.subContent').hide();
    colorIndex = i % 5 + 1;
    $title.aClass('title' + colorIndex).onClick(function() {
      $subContents.slideToggle();
    });
  }));
  tl1 = new tl();
  tl1.from($mainTitle, .7, {
    opacity: 0,
    x: -50,
    width: 0,
    onComplete: function() {
      $mainTitle.css({
        width: '100%'
      });
    }
  }).staggerFrom($title, .3, {
    y: -20,
    opacity: 0
  }, .2, '-=0.3', function() {
    if (cf.router.pageName !== 'index') {
      return $('.subContent').slideDown();
    }
  });
  return $self;
});

cf.router.regAftPage(function() {
  cf.router.$page.commonPage();
});
