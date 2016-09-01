cf.router.regPage('module/cfPiece', function(cf) {
  var $blockMain, $page, $particleX, $particleY, setInput, tm;
  $page = this;
  tm = cf.require('TweenMax');
  setInput = function($input) {
    var value;
    value = parseInt($input.val()) || 1;
    value = value > 10 ? 10 : (value < 1 ? 1 : value);
    $input.val(value);
    return value;
  };
  $particleX = $page.dom('#particleX');
  $particleY = $page.dom('#particleY');
  $blockMain = $page.dom('#blockMain');
  $page.dom('#seperateBtn').onClick(function() {
    var particleX, particleY;
    $blockMain.$pieceContainer && $blockMain.$pieceContainer.remove();
    particleX = setInput($particleX);
    particleY = setInput($particleY);
    $blockMain.show().cfPiece(particleY, particleX, {
      aftPiece: function($piece, yIndex, xIndex) {
        var $content, msg;
        msg = yIndex + '-' + xIndex;
        $content = $('<div/>').css({
          position: 'absolute',
          color: '#fff'
        }).html(msg).appendTo($piece).hide();
        $piece.css({
          cursor: 'pointer'
        }).on('mouseover', function() {
          return $content.show();
        }).on('mouseout', function() {
          return $content.hide();
        }).on('click', function() {
          return tm.to($piece, .5, {
            rotationY: '+=180'
          });
        });
        $piece.css({
          'margin-left': xIndex,
          'margin-top': yIndex
        });
      }
    }).css('margin-top', 50);
    $blockMain.$pieceContainer.css({
      height: $blockMain.height()
    });
  });
  return $page;
});
