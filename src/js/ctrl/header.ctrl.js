
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
      var $img1, $img2, $img3, $pieceArr1, $pieceArr2, $pieceArr3, action1, action2, action3, action4, action5, action6, action7, action8, actionArr, pieceContainerArr, setPieceContainer, showContainer, titleHeight, titleWidth, xPiece, yPiece;
      titleWidth = $headerTitleImg.width();
      titleHeight = $headerTitleImg.height();
      pieceContainerArr = [];
      setPieceContainer = function($container) {
        $container.width(titleWidth);
        $container.height(titleHeight);
        pieceContainerArr.push($container);
        return $container;
      };
      showContainer = function(index) {
        caro.forEach(pieceContainerArr, function($container, i) {
          if (i === index) {
            return $container.show();
          }
          $container.hide();
        });
      };
      $img1 = $headerTitleImg.clone().appendTo($headerTitle).cfPiece(1, 100);
      setPieceContainer($img1.$pieceContainer);
      $pieceArr1 = $img1.$pieceArr;
      $img2 = $headerTitleImg.clone().appendTo($headerTitle).cfPiece(20, 1);
      setPieceContainer($img2.$pieceContainer);
      $pieceArr2 = $img2.$pieceArr;
      yPiece = 6;
      xPiece = 16;
      $img3 = $headerTitleImg.clone().appendTo($headerTitle).cfPiece(yPiece, xPiece);
      setPieceContainer($img3.$pieceContainer);
      $pieceArr3 = $img3.$pieceArr;
      $headerTitleImg.hide();
      action1 = function() {
        showContainer(0);
        tm.staggerFromTo($pieceArr1, .5, {
          rotationX: 0
        }, {
          rotationX: 360
        }, .005);
      };
      action2 = function() {
        showContainer(0);
        caro.forEach($pieceArr1, function($piece, i) {
          var tl1, tl2, x;
          x = i % 2 === 0 ? -5 : 5;
          tl1 = new tl();
          tl2 = new tl({
            repeat: 1
          });
          tl1.to($piece, .2, {
            x: x
          }).to($piece, .2, {
            x: 0
          }).add(tl2.to($piece, .1, {
            x: x
          }).to($piece, .1, {
            x: 0
          }), '+=1');
        });
      };
      action3 = function() {
        var tl1;
        showContainer(0);
        tl1 = new tl();
        tl1.staggerTo($pieceArr1.reverse(), .3, {
          x: 10,
          bezier: [
            {
              y: -5
            }, {
              y: 0
            }
          ]
        }, .01).staggerTo($pieceArr1.reverse(), .3, {
          x: 0,
          bezier: [
            {
              y: 5
            }, {
              y: 0
            }
          ]
        }, .01);
      };
      action4 = function() {
        showContainer(1);
        tm.staggerFromTo($pieceArr2, .5, {
          rotationY: 0
        }, {
          rotationY: 360
        }, .005);
      };
      action5 = function() {
        showContainer(1);
        caro.forEach($pieceArr2, function($piece, i) {
          var tl1, tl2, y;
          y = i % 2 === 0 ? -5 : 5;
          tl1 = new tl();
          tl2 = new tl({
            repeat: 1
          });
          tl1.to($piece, .2, {
            y: y
          }).to($piece, .2, {
            y: 0
          }).add(tl2.to($piece, .1, {
            y: y
          }).to($piece, .1, {
            y: 0
          }), '+=1');
        });
      };
      action6 = function() {
        var tl1;
        showContainer(1);
        tl1 = new tl({
          onComplete: function() {
            $pieceArr2.reverse();
          }
        });
        tl1.staggerTo($pieceArr2, .3, {
          y: -5
        }, .05).staggerTo($pieceArr2.reverse(), .3, {
          y: 0
        }, .05);
      };
      action7 = function() {
        showContainer(2);
        tm.staggerFromTo($pieceArr3, .5, {
          rotationY: 0
        }, {
          rotationY: 360
        }, .005);
      };
      action8 = function() {
        showContainer(2);
        caro.forEach($pieceArr3, function($piece) {
          var tl1, x, xIndex, y, yIndex;
          yIndex = $piece._yIndex;
          xIndex = $piece._xIndex;
          y = yIndex - yPiece / 2;
          x = xIndex - xPiece / 2;
          tl1 = new tl();
          tl1.to($piece, .5, {
            x: x,
            y: y
          }).to($piece, .2, {
            x: 0,
            y: 0
          }, '+=0.1');
        });
      };
      actionArr = [action1, action2, action3, action4, action5, action6, action7, action8];
      caro.setInterval(function() {
        return caro.randomPick(actionArr)();
      }, 5000);
      caro.randomPick(actionArr)();
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
