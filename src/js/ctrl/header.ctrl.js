
/* 有搭配 .html 的 ctrl, 觸發時會讀取 template/ctrl/header.html 檔並寫入 template */
cf.regCtrl('header', function() {
  var $header, $headerBtn, $headerTitle, $self, bgColorArr, cf, setBgColor, tl, tl1, tm;
  $self = this;
  cf = $self.cf;
  tl = cf.require('TimelineMax');
  tm = cf.require('TweenMax');
  bgColorArr = cf.data('bgColorArr');
  setBgColor = function() {
    var color;
    color = caro.randomPick(bgColorArr);
    tm.to($header, 1, {
      backgroundColor: color
    });
  };
  $header = $self.dom();
  $headerTitle = $self.dom('#headerTitle', function($headerTitle) {
    var $headerTitleImg;
    $headerTitle.onClick(function() {
      cf.router.goPage('index');
    });
    $headerTitleImg = $headerTitle.dom('.headerTitleImg');
    $headerTitle.start = function() {
      var $pieceArr, $reversePieceArr, actionArr, detachX, detachY, doPiece, effectArr, flashX, flashY, rotationX, rotationY, setPiece, startRandomAction;
      $pieceArr = [];
      $reversePieceArr = [];
      doPiece = function(yPiece, xPiece) {
        $headerTitleImg.$pieceContainer && $headerTitleImg.$pieceContainer.remove();
        $headerTitleImg.show().cfPiece(yPiece, xPiece, {
          aftPiece: setPiece
        });
      };
      setPiece = function($piece, yIndex, xIndex) {
        $piece.yIndex = yIndex;
        $piece.xIndex = xIndex;
        $pieceArr.push($piece);
        $reversePieceArr.unshift($piece);
      };
      effectArr = [];
      effectArr.push(rotationX = function() {
        var tl1;
        tl1 = new tl();
        tl1.staggerFromTo($pieceArr, .5, {
          rotationX: 0
        }, {
          rotationX: 360
        }, .005);
      });
      effectArr.push(rotationY = function() {
        var tl1;
        tl1 = new tl();
        tl1.staggerFromTo($pieceArr, .5, {
          rotationY: 0
        }, {
          rotationY: 360
        }, .005);
      });
      effectArr.push(flashX = function() {
        caro.forEach($pieceArr, function($piece, i) {
          var tl1;
          tl1 = new tl();
          tl1.to($piece, .2, {
            x: caro.randomInt(10, -10)
          }).to($piece, .2, {
            x: 0
          });
        });
      });
      effectArr.push(flashY = function() {
        caro.forEach($pieceArr, function($piece, i) {
          var tl1;
          tl1 = new tl();
          tl1.to($piece, .2, {
            y: caro.randomInt(10, -10)
          }).to($piece, .2, {
            y: 0
          });
        });
      });
      effectArr.push(detachX = function() {
        caro.forEach($pieceArr, function($piece) {
          tm.to($piece, .2, {
            opacity: 0,
            x: caro.randomInt(30, -30),
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
      effectArr.push(detachY = function() {
        caro.forEach($pieceArr, function($piece) {
          tm.to($piece, .1, {
            opacity: 0,
            y: caro.randomInt(30, -30),
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
      actionArr = [];
      actionArr.push(function() {
        var effectFn;
        doPiece(27, 1);
        effectFn = caro.randomPick(effectArr);
        effectFn();
      });
      actionArr.push(function() {
        var effectFn;
        doPiece(1, 25);
        effectFn = caro.randomPick(effectArr);
        effectFn();
      });
      actionArr.push(function() {
        var effectFn;
        doPiece(5, 5);
        effectFn = caro.randomPick(effectArr);
        effectFn();
      });
      startRandomAction = function() {
        caro.randomPick(actionArr)();
      };
      caro.setInterval(function() {
        startRandomAction();
      }, 5000);
    };
  });
  $headerBtn = $self.dom('.headerBtn');
  tl1 = new tl({
    onComplete: function() {
      $headerTitle.start();
    }
  });
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
    ease: Back.easeOut.config(2)
  }, .2);
  cf.router.regPrePage(setBgColor);
  setBgColor();
  return $self;
}, 'template/ctrl/header.html');

cf.regDocReady(function(cf) {
  var $;
  cf.router.blockGoPage();
  $ = cf.require('$');
  $('#header').header();
});
