
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
    width: 200
  }).from($content, .5, {
    opacity: 0
  }, '-=0.3');
  titleClassArr = ['title', 'subTitle', 'subTitle2', 'subTitle3'];
  caro.forEach(titleClassArr, function(className) {
    return $self.find('.' + className).each(function(i, $class) {
      var $span, html;
      $class = $($class);
      $span = $('<span>').addClass(className);
      html = $class.html();
      return $class.removeClass(className).html($span.html(html));
    });
  });
  $codeTargetArr = [];
  $self.find('.codeTarget').each(function(i, $codeTarget) {
    return $codeTargetArr.push($($codeTarget).cfModal());
  });
  $self.find('.codeLink').each(function(i, $link) {
    var $span, html;
    $link = $($link);
    $span = $('<span>').addClass('link');
    html = $link.html();
    $link.removeClass('link').html($span.html(html));
    return $span.dom().onClick(function() {
      return $codeTargetArr[i].showModal();
    });
  });
  return $self;
});

cf.router.regAftPage(function() {
  cf.router.$page.commonPage();
});
