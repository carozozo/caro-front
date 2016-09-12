cf.regCtrl('bg', function() {
  var $, $bgFloor, $self, bgFloorHeight, bgFloorWidth, blockAmount, blockHeight, blockWidth, caro, tm;
  $self = this;
  caro = cf.require('caro');
  tm = cf.require('TweenMax');
  $ = cf.require('$');
  $bgFloor = $('<div/>').attr('id', 'bgFloor').appendTo($self);
  blockWidth = 30;
  blockHeight = 30;
  blockAmount = 50;
  bgFloorWidth = blockWidth * blockAmount;
  bgFloorHeight = blockHeight * blockAmount;
  caro.loop(function(i) {
    caro.loop(function(j) {
      $('<div/>').addClass((i + j) % 2 === 0 ? 'bgBlock1' : 'bgBlock2').css({
        top: i * blockHeight,
        left: j * blockWidth
      }).appendTo($bgFloor);
    }, 1, blockAmount);
  }, 1, blockAmount);
  tm.set($bgFloor, {
    transformPerspective: 1500,
    rotationX: 80
  });
  tm.from($bgFloor, 3, {
    opacity: 0,
    rotationX: 0
  });
  tm.from('#container', 3, {
    opacity: 0
  });
  cf.router.regPrePage(function() {
    var bindMouse, randX, randY;
    bindMouse = function() {
      var $window;
      $window = cf.$window;
      $window.on('mousemove', function(e) {
        var distX, distY, mouseX, mouseY;
        mouseX = e.pageX - $window.scrollLeft();
        mouseY = e.pageY - $window.scrollTop();
        distX = mouseX / 100;
        distY = mouseY / 100;
        return tm.to($bgFloor, 0, {
          x: randX - distX,
          y: randY - distY
        });
      });
    };
    randX = bgFloorWidth / 2;
    randX = caro.randomInt(0, -randX);
    randY = bgFloorHeight / 8;
    randY = caro.randomInt(randY);
    tm.to($bgFloor, 1, {
      x: randX,
      y: randY,
      onComplete: bindMouse
    });
  });
  return $self;
});

cf.regDocReady(function(cf) {
  var $;
  $ = cf.require('$');
  $('#bg').bg();
});
