
/* 一般的 ctrl */
cf.regCtrl('commonPage', function() {
  var $, $codeTargetArr, $contentArr, $mainTitle, $self, $titles, caro, subTitleClassArr, tl, tl1, tm;
  $self = this;
  caro = cf.require('caro');
  $ = cf.require('$');
  tl = cf.require('TimelineMax');
  tm = cf.require('TweenMax');
  $mainTitle = $self.dom('.mainTitle', function($mainTitle) {
    var actArr;
    actArr = [];
    actArr.push(function() {
      $mainTitle.cfSplitText({
        charCb: function($char, i) {
          tm.set($char, {
            perspective: 400
          });
          tm.from($char, 1, {
            opacity: 0,
            x: -100,
            y: -50,
            rotationX: 180,
            ease: Back.easeOut,
            delay: 1 + i * .05
          });
        }
      });
    });
    actArr.push(function() {
      $mainTitle.cfSplitText({
        charCb: function($char, i) {
          tm.set($char, {
            perspective: 400
          });
          tm.from($char, 1, {
            opacity: 0,
            y: 50,
            rotationX: 180,
            ease: Back.easeOut,
            delay: 1 + i * .05
          });
        }
      });
    });
    actArr.push(function() {
      $mainTitle.cfSplitText({
        charCb: function($char, i) {
          tm.set($char, {
            perspective: 400
          });
          tm.from($char, .5, {
            rotationX: 90,
            delay: 1 + i * .05
          });
        }
      });
    });
    caro.randomPick(actArr)();
  });
  $titles = [];
  $contentArr = $self.dom('.content').coverToArr(function($content, i) {
    var $subContent, $title;
    $content.isOpen = false;
    $content.$title = $title = $content.dom('.title', function($title) {
      var colorIndex;
      $titles.push($title);
      colorIndex = i % 5 + 1;
      return $title.aClass('title' + colorIndex).onClick(function() {
        if (!$content.isOpen) {
          $content.isOpen = true;
          $subContent.slideDown();
        } else {
          $content.isOpen = false;
          $subContent.slideUp();
        }
      }).on('mouseenter', function() {
        return tm.to($title, .4, {
          scale: 1.02
        });
      }).on('mouseleave', function() {
        return tm.to($title, .4, {
          scale: 1
        });
      });
    });
    $subContent = $title.next('div').addClass('subContent').css({
      position: 'relative'
    }).hide();
  });
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
  tl1 = new tl();
  tl1.from($mainTitle, .7, {
    width: '0%'
  }).staggerFrom($titles, .3, {
    opacity: 0,
    rotationX: 90,
    y: -50
  }, .2, '-=0.5').add(function() {
    if (cf.router.pageName === 'index') {
      $contentArr[0].$title.click();
    } else {
      caro.forEach($contentArr, function($content) {
        return $content.$title.click();
      });
    }
  });
  return $self;
});

cf.router.regAftPage(function() {
  cf.router.$page.commonPage();
});
