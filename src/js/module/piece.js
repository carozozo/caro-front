
/*
切片效果,切片後 $self 會隱藏, 注意切片後為固定寬高
 */
cf.regModule('cfPiece', function(particleY, particleX) {
  var $self, pieceHeight, pieceWidth, selfHeight, selfWidth;
  if (particleY == null) {
    particleY = 3;
  }
  if (particleX == null) {
    particleX = 3;
  }

  /*
  particleY: y 切成幾等份
  particleX: x 切成幾等份
   */
  $self = this;
  selfWidth = $self.width();
  selfHeight = $self.height();

  /* 每個等份的寬 */
  pieceWidth = Math.round(selfWidth / particleX);

  /* 每個等份的高 */
  pieceHeight = Math.round(selfHeight / particleY);

  /* 儲存每個切片 */
  $self.$pieceArr = [];

  /* 儲存切片陣列 */
  $self.$pieceTable = [];

  /* 外部切片的容器, 繼承 $self 的 css position 屬性 */
  $self.$pieceContainer = $('<div/>').css({
    position: $self.css('position')
  }).insertAfter($self);

  /* 內部切片容器, 協助切片定位 */
  $self.$pieceInnerContainer = $('<div/>').css({
    position: 'relative'
  }).appendTo($self.$pieceContainer);
  caro.loop(function(i) {
    var xPieceArr;
    xPieceArr = [];
    $self.$pieceTable.push(xPieceArr);
    caro.loop(function(j) {
      var $piece, pieceLeft, pieceTop;
      pieceLeft = pieceWidth * j;
      pieceTop = pieceHeight * i;
      $piece = $('<div/>').css({
        position: 'absolute',
        width: pieceWidth,
        height: pieceHeight,
        overflow: 'hidden',
        left: pieceLeft,
        top: pieceTop
      }).appendTo($self.$pieceInnerContainer);
      $self.clone().appendTo($piece).css({
        position: 'absolute',
        visibility: 'visible',
        margin: 0,
        padding: 0,
        width: selfWidth,
        height: selfHeight,
        left: -(pieceWidth * j),
        top: -(pieceHeight * i)
      });

      /* 儲存切片在 y 軸的 index */
      $piece._yIndex = i;

      /* 儲存切片在 x 軸的 index */
      $piece._xIndex = j;
      $self.$pieceArr.push($piece);
      xPieceArr.push($piece);
    }, 0, particleX - 1);
  }, 0, particleY - 1);
  return $self.hide();
});
