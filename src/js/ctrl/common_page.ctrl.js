
/* 一般的 ctrl */
cf.regCtrl('commonPage', function() {
  var $codes, $content, $mainTitle, $self, cf, titleClassArr, tl, tl1;
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
  $codes = $self.find('.code').hide();
  $self.find('.codeLink').each(function(i, $link) {
    $link = $($link).dom();
    return $link.onClick(function() {
      return $($codes[i]).fadeToggle();
    });
  });
  return $self;
});

cf.router.regAftPage(function() {
  cf.router.$page.commonPage();
});
