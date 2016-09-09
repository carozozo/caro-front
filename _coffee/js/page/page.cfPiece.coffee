cf.router.regPage 'module/cfPiece', (cf) ->
  $page = @
  tm = cf.require('TweenMax')
  setInput = ($input) ->
    value = parseInt($input.val()) or 1
    value = if value > 10 then 10 else (if value < 1 then 1 else value)
    $input.val(value)
    value

  $particleX = $page.dom('#particleX')
  $particleY = $page.dom('#particleY')
  $blockMain = $page.dom('#blockMain')
  blockMainHeight = null

  $page.dom('#seperateBtn').onClick(->
    $blockMain.reversePiece and $blockMain.reversePiece()
    particleX = setInput($particleX)
    particleY = setInput($particleY)
    $blockMain.cfPiece(particleY, particleX, {
      aftPiece: ($piece, yIndex, xIndex) ->
        msg = yIndex + '-' + xIndex
        $content = $('<div/>').css(
          position: 'absolute'
          color: '#fff'
        ).html(msg).appendTo($piece).hide()
        $piece.css(
          cursor: 'pointer'
        ).on('mouseover', ->
          $content.show()
        ).on('mouseout', ->
          $content.hide()
        ).on('click', ->
          tm.to($piece, .5,
            rotationY: '+=180'
          )
        )
        $piece.css(
          'margin-left': xIndex
          'margin-top': yIndex
        )
        return
    })
    $blockMain.$pieceContainer.css(
      height: blockMainHeight or blockMainHeight = $blockMain.height()
    )
    return
  )

  $page.dom('#reverseBtn').onClick(->
    $blockMain.reversePiece and $blockMain.reversePiece()
    return
  )
  $page