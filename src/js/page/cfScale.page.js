cf.router.regPage('module/cfScale', function(cf, $page) {
  var $, $block, $infoBox, setInfo;
  $ = cf.require('$');
  setInfo = function(title, msg) {
    msg = title + ': ' + msg;
    return $('<div/>').html(msg);
  };
  $block = $page.dom('#block').css({
    width: 500,
    height: 200,
    'background-color': '#c7c738'
  });
  $infoBox = $page.dom('#infoBox').css({
    height: 200
  });
  $block.cfScale('block', {
    startScale: .5,
    startX: 0,
    startY: 0,
    isScaleY: true,
    mode: 'min',
    aftScale: function(infoObj) {
      var $self, $target, scale, scaleX, scaleY, selfInfo, targetInfo;
      $infoBox.empty();
      $self = infoObj.$self[0].toString();
      $target = infoObj.$target[0].toString();
      selfInfo = JSON.stringify(infoObj.selfInfo, null, 2);
      targetInfo = JSON.stringify(infoObj.targetInfo, null, 2);
      scaleX = infoObj.scaleX;
      scaleY = infoObj.scaleY;
      scale = infoObj.scale;
      $infoBox.append(setInfo('$self', $self)).append(setInfo('$target', $target)).append(setInfo('selfInfo', selfInfo)).append(setInfo('targetInfo', targetInfo)).append(setInfo('scaleX', scaleX)).append(setInfo('scaleY', scaleY)).append(setInfo('scale', scale));
    }
  });
  return $page;
});
