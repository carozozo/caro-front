
/*
客製化的 alert, 用來取代 js 原生 alert, 防止被 browser 阻擋
 */
cf.regDocReady(function(cf) {
  var tl, window;
  window = cf.require('window');
  tl = cf.require('TimelineMax');

  /* 置換 alert */
  window.alert = function(msg, opt) {
    var $background, $box, $msg, _$target, _cb, tl1;
    if (opt == null) {
      opt = {};
    }
    tl1 = new tl({
      onReverseComplete: function() {
        $box.remove();
      }
    });

    /* alert 視窗要放至的位置 */
    _$target = opt.$target || cf.$body;

    /* 點選 ok 之後觸發的 cb */
    _cb = opt.cb;
    $box = $('<div/>').addClass('alert');
    $background = $('<div/>').addClass('alertBg');
    $msg = $('<div/>').addClass('alertMsg').appendTo($box);
    $('<div />').addClass('alertOkBtn').on('click', function() {
      tl1.timeScale(1.5).reverse();
      $background.remove();
      return _cb && _cb();
    }).html('OK').appendTo($box);
    $msg.html(msg);
    _$target.append($box).append($background);
    $box.css({
      'margin-left': -$box.outerWidth() / 2
    });
    tl1.from($box, .6, {
      y: -$box.outerHeight(),
      ease: Back.easeOut.config(2)
    });
  };
});
