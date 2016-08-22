cf.router.regPage('module/cfMouseStyle', function(cf, $page) {
  var $mouse, $mouseDiv;
  $mouseDiv = $page.dom('#mouseDiv').css({
    height: 300
  });
  $mouse = $page.dom('#mouse').src('images/hand.png');
  $mouseDiv.cfMouseStyle($mouse);
  return $page;
});
