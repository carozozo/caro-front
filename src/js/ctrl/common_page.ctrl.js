
/* 一般的 ctrl */
cf.regCtrl('commonPage', function() {
  var $, $codeTargetArr, $mainTitle, $self, $titles, directionOpt, directionOptArr, distance, key, subTitleClassArr, titleOpt, tl, tl1, tm, val;
  $self = this;
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
    cf.randomPick(actArr)();
    $mainTitle.init = function() {
      $mainTitle.width('100%');
    };
  });
  subTitleClassArr = ['subTitle1', 'subTitle2', 'subTitle3', 'subTitle4', 'subTitle5'];
  cf.forEach(subTitleClassArr, function(className) {
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
    var $subContent, color, colorIndex;
    $subContent = $title.next('div').addClass('subContent').css({
      position: 'relative'
    }).hide();
    colorIndex = i % 5 + 1;
    $title.aClass('title' + colorIndex).onClick(function() {
      $subContent.slideToggle();
    });
    $title.isOpen = true;
    color = $title.css('color');
    $title.on('mouseover', function() {
      return tm.to($title, .4, {
        x: 10,
        color: '#fff'
      });
    }).on('mouseleave', function() {
      return tm.to($title, .4, {
        x: 0,
        color: color
      });
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
  directionOpt = cf.randomPick(directionOptArr);
  titleOpt = {
    opacity: 0,
    rotationX: 90,
    transformPerspective: 600
  };
  for (key in directionOpt) {
    val = directionOpt[key];
    titleOpt[key] = val;
  }
  tl1 = new tl();
  tl1.from($mainTitle, .7, {
    width: 0,
    delay: .5
  }).add($mainTitle.init).staggerFromTo($titles, .3, titleOpt, {
    x: 0,
    y: 0,
    opacity: 1,
    rotationX: 0
  }, .2, '-=0.5', function() {
    if (cf.router.pageName === 'index') {
      $($('.subContent')[0]).slideDown();
    } else {
      $('.subContent').slideDown();
    }
  });
  return $self;
});

cf.router.regAftPage(function() {
  cf.router.$page.commonPage();
});
