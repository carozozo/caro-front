cf.regCtrl('bg', function() {
  var $bgContainer, $self, tm;
  $self = this;
  tm = cf.require('TweenMax');
  $bgContainer = $('<div/>').attr('id', 'bgContainer').appendTo($self);
  caro.loop(function(i) {
    caro.loop(function(j) {
      $('<div/>').addClass('bgBlock').css({
        top: i * 30,
        left: j * 30
      }).appendTo($bgContainer);
    }, 1, 70);
  }, 1, 35);
  tm.set($bgContainer, {
    transformPerspective: 500,
    rotationX: 85
  });
  cf.router.regPrePage(function() {
    return tm.to('#bgContainer', 1, {
      x: cf.randomInt(0, -500),
      rotationX: cf.randomInt(89, 70)
    });
  });
  cf.router.regAftPage(function() {
    var $window;
    $window = cf.$window;
    $window.on('scroll', function() {
      var left, scrollTop, top;
      scrollTop = $window.scrollTop();
      left = scrollTop / 10;
      top = scrollTop / 100;
      tm.to($bgContainer, .5, {
        x: -left,
        y: -top
      });
    });
  });
  return $self;
});

cf.regDocReady(function(cf) {
  var $;
  $ = cf.require('$');
  $('#bg').bg();
});
