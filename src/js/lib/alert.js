
/*
客製化的 alert, 用來取代 js 原生 alert, 防止被 browser 阻擋
 */
cf.regLib('alert', function(cf) {
  return function(msg, opt) {
    var $, $background, $box, $msg, _$target, _cb, tl, tl1;
    if (opt == null) {
      opt = {};
    }
    $ = cf.require('$');
    tl = cf.require('TimelineMax');
    tl1 = new tl({
      onReverseComplete: function() {
        $box.remove();
      }
    });

    /* alert 視窗要放至的位置 */
    _$target = opt.$target || cf.$body;

    /* 點選 ok 之後觸發的 cb */
    _cb = opt.cb;
    $box = $('<div/>').addClass('cfAlert');
    $background = $('<div/>').addClass('cfAlertBg');
    $msg = $('<div/>').addClass('cfAlertMsg').appendTo($box);
    $('<div />').addClass('cfAlertOkBtn').on('click', function() {
      tl1.timeScale(1.5).reverse();
      $background.remove();
      return cb && cb();
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
