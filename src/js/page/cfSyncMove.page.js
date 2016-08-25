cf.router.regPage('module/cfSyncMove', function(cf, $page) {
  var $block1, $block2, $block3, $infoBox, bgColorArr, getBaseY, setBlock;
  bgColorArr = cf.data('bgColorArr');
  setBlock = function($block, color) {
    $block.css({
      width: 120,
      height: 120,
      display: 'inline-block',
      'margin-left': 50,
      'background-color': color
    });
  };
  getBaseY = function() {
    return cf.$window.height() / 2;
  };
  $infoBox = $page.dom('#infoBox');
  $block1 = $page.dom('#block1').cfSyncMove('block1', {
    befMove: function(infoObj) {
      delete infoObj.$self;
      delete infoObj.event;
      $infoBox.html(JSON.stringify(infoObj));
    }
  });
  $block2 = $page.dom('#block2').cfSyncMove('block2', {
    baseY: getBaseY
  });
  $block3 = $page.dom('#block3').cfSyncMove('block3', {
    baseX: false,
    baseY: getBaseY
  });
  setBlock($block1, bgColorArr[0]);
  setBlock($block2, bgColorArr[1]);
  setBlock($block3, bgColorArr[2]);
  $page.dom('#startBtn').onClick(function() {
    $block1.startSyncMove();
    $block2.startSyncMove();
    return $block3.startSyncMove();
  }).click();
  $page.dom('#stopBtn').onClick(function() {
    $block1.stopSyncMove();
    $block2.stopSyncMove();
    return $block3.stopSyncMove();
  });
  return $page;
});
