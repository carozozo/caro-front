cf.router.regPage('module/cfRandomDrop', function(cf, $page) {
  var $, $downBlock, $img1, $img2, $img3, $img4, $imgArr, $upBlock, createImg, setBlock;
  $ = cf.require('$');
  createImg = function(color) {
    return $('<div/>').css({
      width: 20,
      height: 20,
      'background-color': color,
      'border-radius': 10
    });
  };
  setBlock = function($block) {
    return $block.css({
      padding: 0,
      height: 200,
      display: 'inline-block',
      width: '45%'
    });
  };
  $img1 = createImg('#628320');
  $img2 = createImg('#c72228');
  $img3 = createImg('#34bfc7');
  $img4 = createImg('#c7c738');
  $imgArr = [$img1, $img2, $img3, $img4];
  $downBlock = $page.dom('#downBlock');
  $upBlock = $page.dom('#upBlock');
  setBlock($downBlock);
  setBlock($upBlock);
  $downBlock.cfRandomDrop($imgArr).startDrop();
  $upBlock.cfRandomDrop($imgArr, {
    reverse: true,
    xRange: 10,
    minScale: .5
  }).setCursor().moveCreate().clickCreate();
  return $page;
});
