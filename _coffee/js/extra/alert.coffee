###
客製化的 alert, 用來取代 js 原生 alert, 防止被 browser 阻擋
###
cf.regDocReady((cf) ->
  window = cf.require 'window'
  tl = cf.require 'TimelineMax'
  ### 置換 alert ###
  window.alert = (msg, opt = {}) ->
    tl1 = new tl(
      onReverseComplete: ->
        $box.remove()
        return
    )
    ### alert 視窗要放至的位置 ###
    _$target = opt.$target or cf.$body
    ### 點選 ok 之後觸發的 cb ###
    _cb = opt.cb
    $box = $('<div/>').addClass('alert')
    $background = $('<div/>').addClass('alertBg')
    $msg = $('<div/>').addClass('alertMsg').appendTo($box)
    $('<div />').addClass('alertOkBtn').on('click', ->
      tl1.timeScale(1.5).reverse()
      $background.remove()
      _cb and _cb()
    ).html('OK').appendTo($box)

    $msg.html(msg)
    _$target.append($box).append($background)
    $box.css('margin-left': -$box.outerWidth() / 2)
    tl1.from($box, .6,
      y: -$box.outerHeight()
      ease: Back.easeOut.config(2)
    )
    return
  return
)