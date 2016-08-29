
/* 一般的 ctrl */
cf.regCtrl('commonPage', function() {
  var $, $codeTargetArr, $mainTitle, $self, $titles, cf, directionOpt, directionOptArr, distance, subTitleClassArr, titleOpt, tl, tl1;
  $self = this;
  cf = $self.cf;
  $ = cf.require('$');
  tl = cf.require('TimelineMax');
  $mainTitle = $self.dom('.mainTitle');
  subTitleClassArr = ['subTitle1', 'subTitle2', 'subTitle3', 'subTitle4', 'subTitle5'];
  caro.forEach(subTitleClassArr, function(className) {
    $self.dom('.' + className).eachDom(function($subTitle) {
      var $span, html;
      $span = $('<span>').addClass(className);
      html = $subTitle.html();
      $subTitle.removeClass(className).css({
        'margin-top': 5
      }).html($span.html(html));
      $subTitle.next('div').addClass('subContent');
    });
  });
  $codeTargetArr = $self.dom('.codeTarget').coverToArr(function($codeTarget) {
    $codeTarget.addClass('block1').cfModal();
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
  $titles = $self.dom('.title').eachDom(function($title, i) {
    var $subContent, colorIndex;
    $subContent = $title.next('div').addClass('subContent').css({
      position: 'relative'
    }).hide();
    colorIndex = i % 5 + 1;
    $title.aClass('title' + colorIndex).onClick(function() {
      $subContent.slideToggle();
    });
  });
  distance = 30;
  directionOptArr = [
    {
      x: -distance
    }, {
      x: distance
    }, {
      y: -distance
    }, {
      y: distance
    }
  ];
  directionOpt = caro.randomPick(directionOptArr);
  titleOpt = {
    opacity: 0,
    rotationX: 90,
    transformPerspective: 600
  };
  titleOpt = caro.assign(titleOpt, directionOpt);
  tl1 = new tl();
  tl1.from($mainTitle, .7, {
    width: 300,
    delay: .5
  }).staggerFromTo($titles, .3, titleOpt, {
    x: 0,
    y: 0,
    opacity: 1,
    rotationX: 0
  }, .2, '-=0.5', function() {
    if (cf.router.pageName !== 'index') {
      $('.subContent').slideDown();
    }
  });
  return $self;
});

cf.router.regAftPage(function() {
  cf.router.$page.commonPage();
});
