cf.router.regPage('lib/router', function(cf) {
  var $page, _router, window;
  $page = this;
  window = cf.require('window');
  _router = cf.router;
  $page.dom('#getPageBtn').onClick(function() {
    return alert(_router.getPageByHash());
  });
  $page.dom('#getSearchBtn').onClick(function() {
    return alert(_router.getSearchByHash());
  });
  $page.dom('#getSearchObjBtn').onClick(function() {
    return alert(JSON.stringify(_router.parseUrlSearch()));
  });
  $page.dom('#goPageBtn1').onClick(function() {
    return _router.goPage('lib/router');
  });
  $page.dom('#goPageBtn2').onClick(function() {
    return _router.goPage();
  });
  $page.dom('#goPageBtn3').onClick(function() {
    return _router.goPage('lib/router?name=pikachu&age=200');
  });
  $page.dom('#blockGoPageBtn').onClick(function() {
    _router.blockGoPage();
    return alert('現在無法換頁');
  });
  $page.dom('#approveGoPageBtn').onClick(function() {
    _router.approveGoPage();
    return alert('現在允許換頁');
  });
  return $page;
});
