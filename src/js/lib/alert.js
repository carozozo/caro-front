
/* 客製化的 alert, 用來取代 js 原生 alert, 防止被 browser 阻擋 */
cf.regLib('alert', function(cf) {
  return function(msg) {
    var $, $background, $box, $msg, $okBtn, tl, tl1, zIndex;
    $ = cf.require('$');
    tl = cf.require('TimelineMax');
    tl1 = new tl({
      onReverseComplete: function() {
        $box.remove();
      }
    });
    zIndex = 9999999;
    $box = $('<div/>').attr('class', 'caroAlert').css({
      'position': 'fixed',
      'z-index': zIndex + 1,
      'font-size': 18,
      'text-align': 'center',
      'padding': '30px 10px 10px 10px',
      'top': '10%',
      'left': '50%',
      'min-width': 200,
      'max-width': 300,
      'box-shadow': '5px 5px 20px grey',
      'border-radius': 10,
      border: '3px #808080',
      color: '#0f1711',
      background: '#fff'
    });
    $background = $('<div/>').css({
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      'z-index': zIndex
    });
    $msg = $('<div/>').css({
      'padding': 5
    }).appendTo($box);
    $okBtn = $('<div />').css({
      'margin-top': 30,
      'padding': 10,
      'background': '#ccc',
      'cursor': 'pointer'
    }).on('mouseover', function() {
      return $okBtn.css({
        'background': '#ddd'
      });
    }).on('mouseleave', function() {
      return $okBtn.css({
        'background': '#ccc'
      });
    }).on('click', function() {
      tl1.timeScale(1.5).reverse();
      return $background.remove();
    }).html('OK').appendTo($box);
    $msg.html(msg);
    cf.$body.append($box).append($background);
    $box.css({
      'margin-left': -$box.outerWidth() / 2
    });
    return tl1.from($box, .6, {
      y: -$box.outerHeight(),
      ease: Back.easeOut.config(2)
    });
  };
});
