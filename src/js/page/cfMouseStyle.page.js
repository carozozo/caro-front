cf.router.regPage('module/cfMouseStyle', function() {
  var $mouse, $mouseArea, $page;
  $page = this;
  $mouseArea = $page.dom('#mouseArea').css({
    height: 300
  });
  $mouse = $page.dom('#mouse').src('images/hand.png').css({
    'z-index': 100
  });
  $mouseArea.cfMouseStyle($mouse);
  return $page;
});
