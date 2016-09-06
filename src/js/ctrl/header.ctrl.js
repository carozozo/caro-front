
/* 有搭配 .html 的 ctrl, 觸發時會讀取 template/ctrl/header.html 檔並寫入 template */
cf.regCtrl('header', function() {
  var $header, $headerBg, $headerBtn, $headerTitle, $self, bgColorArr, setBgColor, tl, tl1, tm;
  $self = this;
  tl = cf.require('TimelineMax');
  tm = cf.require('TweenMax');
  bgColorArr = cf.data('bgColorArr');
  setBgColor = function() {
    var color;
    color = cf.randomPick(bgColorArr);
    tm.to($header, 1, {
      backgroundColor: color
    });
  };
  $header = $self.dom();
  $headerTitle = $self.dom('#headerTitle', function($headerTitle) {
    var $headerTitleImg, $pieceContainerArr, $pieceMapArr, detachX, detachY, doPiece, effectArr, flashX, flashY, randomAnimation, rotationX, rotationY;
    $headerTitle.onClick(function() {
      cf.router.goPage('index');
    }).on('mouseenter', function() {

      /* 不明確原因, 在 $headerTitle 裡面移動 mouseenter 會被多次觸發 */
      if (!$headerTitle.isLeaved) {
        return;
      }
      $headerTitle.isLeaved = false;
    }).on('mouseleave', function() {
      $headerTitle.isLeaved = true;
    });
    $headerTitleImg = $headerTitle.dom('.headerTitleImg');
    $pieceMapArr = [];
    $pieceContainerArr = [];
    doPiece = function(yPiece, xPiece) {
      var $pieceContainer, $pieceMap;
      $pieceMap = {
        $pieceContainer: null,
        $pieceArr: []
      };
      $headerTitleImg.show().cfPiece(yPiece, xPiece, {
        aftPiece: function($piece, yIndex, xIndex) {
          $piece.yIndex = yIndex;
          $piece.xIndex = xIndex;
          $pieceMap.$pieceArr.push($piece);
        }
      });
      $pieceContainer = $pieceMap.$pieceContainer = $headerTitleImg.$pieceContainer;
      $pieceContainerArr.push($pieceContainer);
      $pieceMapArr.push($pieceMap);
    };
    doPiece(27, 1);
    doPiece(1, 25);
    doPiece(5, 5);
    effectArr = [];
    effectArr.push(rotationX = function($pieceArr) {
      var tl1;
      tl1 = new tl();
      tl1.staggerFromTo($pieceArr, .5, {
        rotationX: 0
      }, {
        rotationX: 360
      }, .005);
    });
    effectArr.push(rotationY = function($pieceArr) {
      var tl1;
      tl1 = new tl();
      tl1.staggerFromTo($pieceArr, .5, {
        rotationY: 0
      }, {
        rotationY: 360
      }, .005);
    });
    effectArr.push(flashX = function($pieceArr) {
      cf.forEach($pieceArr, function($piece) {
        var tl1;
        tl1 = new tl();
        tl1.to($piece, .2, {
          x: cf.randomInt(10, -10)
        }).to($piece, .2, {
          x: 0
        });
      });
    });
    effectArr.push(flashY = function($pieceArr) {
      cf.forEach($pieceArr, function($piece, i) {
        var tl1;
        tl1 = new tl();
        tl1.to($piece, .2, {
          y: cf.randomInt(10, -10)
        }).to($piece, .2, {
          y: 0
        });
      });
    });
    effectArr.push(detachX = function($pieceArr) {
      cf.forEach($pieceArr, function($piece) {
        tm.to($piece, .2, {
          opacity: 0,
          x: cf.randomInt(30, -30),
          delay: Math.random(),
          onComplete: function() {
            setTimeout(function() {
              return tm.set($piece, {
                opacity: 1,
                x: 0
              });
            }, 1000);
          }
        });
      });
    });
    effectArr.push(detachY = function($pieceArr) {
      cf.forEach($pieceArr, function($piece) {
        tm.to($piece, .1, {
          opacity: 0,
          y: cf.randomInt(30, -30),
          delay: Math.random(),
          onComplete: function() {
            setTimeout(function() {
              return tm.set($piece, {
                opacity: 1,
                y: 0
              });
            }, 1000);
          }
        });
      });
    });
    randomAnimation = function() {
      var $pieceMap, effectFn;
      effectFn = cf.randomPick(effectArr);
      $pieceMap = cf.randomPick($pieceMapArr);
      cf.forEach($pieceContainerArr, function($pieceContainer) {
        $pieceContainer.hide();
      });
      $pieceMap.$pieceContainer.show();
      effectFn($pieceMap.$pieceArr);
    };
    setInterval(randomAnimation, 3000);
  });
  $headerBtn = $self.dom('.headerBtn');
  $headerBg = $self.dom('#headerBg');
  $headerBg.dom('.strip', function($strip) {
    var $strips, setStrip;
    setStrip = function($dom, obj) {
      return tm.set($dom, obj);
    };
    caro.loop(function() {
      var $clone, eachWidth, right;
      $clone = $strip.clone();
      eachWidth = Math.random() * 10;
      right = Math.random() * 300;
      $clone = $strip.clone().appendTo($headerBg);
      setStrip($clone, {
        width: eachWidth,
        right: right,
        opacity: Math.random()
      });
      return tm.from($clone, 1, {
        x: 300,
        ease: Back.easeOut.config(3),
        delay: Math.random()
      });
    }, 1, 50);
    $strips = $headerBg.dom('.strip');
    setInterval(function() {
      $strips.eachDom(function($strip) {
        setTimeout(function() {
          tm.to($strip, Math.random() + .5, {
            right: Math.random() * 300,
            ease: Back.easeOut.config(Math.random() * 3)
          });
        }, Math.random() * 2000);
      });
    }, 10000);
    return $strip.remove();
  });
  tl1 = new tl();
  tl1.from($headerTitle, 1, {
    opacity: 0,
    y: -50,
    ease: Elastic.easeOut.config(1, 0.4)
  }).staggerFrom($headerBtn, .5, {
    opacity: 0,
    x: -50,
    ease: Back.easeOut.config(2)
  }, .2);
  cf.router.regPrePage(function() {
    setBgColor();
  });
  return $self;
}, 'template/ctrl/header.html');

cf.regDocReady(function(cf) {
  var $;
  $ = cf.require('$');
  $('#header').header();
});
