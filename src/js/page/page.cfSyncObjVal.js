cf.router.regPage('module/cfSyncObjVal', function(cf) {
  var $, $otherBtnsBox, $page, $resetBox, $startBox, $target, obj, targetHtml, window;
  $page = this;
  window = cf.require('window');
  $ = cf.require('$');
  obj = {
    a: 1,
    b: 2
  };
  $target = $page.dom('#target');
  targetHtml = $target.html();
  $startBox = $page.dom('#startBox');
  $resetBox = $page.dom('#resetBox').hide();
  $otherBtnsBox = $page.dom('#otherBtnsBox').hide();
  $page.dom('#startBtn').onClick(function() {
    $target.cfSyncObjVal(obj);
    $startBox.hide();
    $resetBox.show();
    return $otherBtnsBox.show();
  });
  $page.dom('#setBtn1').onClick(function() {
    return obj.a = 'Caro';
  });
  $page.dom('#setBtn2').onClick(function() {
    return obj.a = null;
  });
  $page.dom('#setBtn3').onClick(function() {
    return obj.b = 'Front';
  });
  $page.dom('#setBtn4').onClick(function() {
    return obj.b = void 0;
  });
  $page.dom('#resetBtn').onClick(function() {
    obj.a = 1;
    obj.b = 2;
    $target.html(targetHtml);
    $startBox.show();
    $resetBox.hide();
    return $otherBtnsBox.hide();
  });
  return $page;
});
