### 客製化的 alert, 用來取代 js 原生 alert, 防止被 browser 阻擋 ###
### 使用 cf_alert.css ###
cf.regLib 'alert', (cf) ->
  (msg, opt = {}) ->
    $ = cf.require '$'
    tl = cf.require 'TimelineMax'
    tl1 = new tl(
      onReverseComplete: ->
        $box.remove()
        return
    )
    ### alert DOM 要放至的位置 ###
    _$target = opt.$target or cf.$body
    $box = $('<div/>').addClass('cfAlert')
    $background = $('<div/>').addClass('cfAlertBg')
    $msg = $('<div/>').addClass('cfAlertMsg').appendTo($box)
    $('<div />').addClass('cfAlertOkBtn').on('click', ->
      tl1.timeScale(1.5).reverse()
      $background.remove()
    ).html('OK').appendTo($box)

    $msg.html(msg)
    _$target.append($box).append($background)
    $box.css('margin-left': -$box.outerWidth() / 2)
    tl1.from($box, .6,
      y: -$box.outerHeight()
      ease: Back.easeOut.config(2)
    )
    return