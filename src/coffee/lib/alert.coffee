### 客製化的 alert, 用來取代 js 原生 alert, 防止被 browser 阻擋 ###
cf.regLib 'alert', (cf) ->
  self = (msg) ->
    $ = cf.require '$'
    zIndex = 9999999
    $box = $('<div/>').attr('class', 'caroAlert').css({
      'position': 'fixed'
      'z-index': zIndex + 1
      'font-size': 18
      'text-align': 'center'
      'padding': '30px 10px 10px 10px'
      'top': '10%'
      'left': '50%'
      'min-width': 200
      'box-shadow': '5px 5px 20px grey'
      border: '3px #808080'
      color: '#0f1711'
      background: '#fff'
    }).hide()

    $background = $('<div/>').css(
      position: 'absolute'
      top: 0
      left: 0
      width: '100%'
      height: '100%'
      'z-index': zIndex
    )

    $msg = $('<div/>').css('padding': 5).appendTo($box)

    $okBtn = $('<div />').css(
      'margin-top': 30
      'padding': 10
      'background': '#ccc'
      'cursor': 'pointer'
    ).html('OK').appendTo($box)

    $okBtn.on('click', ->
      $box.fadeOut(->
        $box.remove()
        $background.remove()
      )
    )
    $msg.html(msg)
    cf.$body.append($box).append($background)
    $box.css('margin-left': -$box.outerWidth() / 2).fadeIn()
    self
  self