###
切片效果,切片後 $self 會隱藏, 注意切片後為固定寬高
###
cf.regModule 'cfPiece', (particleY = 3, particleX = 3, opt = {}) ->
  ###
  particleY: y 切成幾等份
  particleX: x 切成幾等份
  ###
  $self = @
  selfWidth = $self.width()
  selfHeight = $self.height()

  ### 每次置入 $piece 前呼叫的 cb, return false 則不值置入 ###
  _befPiece = opt.befPiece
  ### 每次置入 $piece 後呼叫的 cb ###
  _aftPiece = opt.aftPiece

  ### 每個等份的寬 ###
  pieceWidth = selfWidth / particleX
  ### 每個等份的高 ###
  pieceHeight = selfHeight / particleY
  ### 外部切片的容器, 繼承 $self 的 css position 屬性 ###
  $self.$pieceContainer = $('<div/>').addClass('cfPieceContainer').css(
    position: $self.css('position')
  ).insertAfter($self)
  ### 內部切片容器, 協助切片定位 ###
  $self.$pieceInnerContainer = $('<div/>').addClass('cfPieceInnerContainer').css(
    position: 'relative'
  ).appendTo($self.$pieceContainer)

  cf.loop((i) ->
    cf.loop((j) ->
      return if _befPiece and _befPiece(i, j) is false
      pieceLeft = pieceWidth * j
      pieceTop = pieceHeight * i
      $piece = $('<div/>').addClass('cfPiece').css(
        position: 'absolute'
        width: pieceWidth
        height: pieceHeight
        overflow: 'hidden'
        left: pieceLeft
        top: pieceTop
      ).appendTo($self.$pieceInnerContainer)
      $self.clone().appendTo($piece).css(
        position: 'absolute'
        visibility: 'visible'
        margin: 0
        padding: 0
        width: selfWidth
        height: selfHeight
        left: -(pieceWidth * j)
        top: -(pieceHeight * i)
      )
      _aftPiece and _aftPiece($piece, i, j)
      return
    , 0, particleX - 1)
    return
  , 0, particleY - 1)

  $self.hide()