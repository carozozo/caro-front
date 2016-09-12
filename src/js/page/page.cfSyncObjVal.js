cf.router.regPage('module/cfSyncObjVal', function(cf) {
  var $, $otherBtnsBox, $page, $target, obj, targetHtml, window;
  $page = this;
  window = cf.require('window');
  $ = cf.require('$');
  obj = {
    a: 1,
    b: 2
  };
  $target = $page.dom('#target');
  targetHtml = $target.html();
  $otherBtnsBox = $page.dom('#otherBtnsBox').hide();
  $page.dom('#setBtn1').onClick(function() {
    $target.cfWatch(obj);
    return $otherBtnsBox.show();
  });
  $page.dom('#setBtn2').onClick(function() {
    return obj.a = 'Caro';
  });
  $page.dom('#setBtn3').onClick(function() {
    return obj.b = 'Front';
  });
  $page.dom('#setBtn4').onClick(function() {
    return obj.a = null;
  });
  $page.dom('#resetBtn').onClick(function() {
    return $target.html(targetHtml);
  });
  return $page;
});
