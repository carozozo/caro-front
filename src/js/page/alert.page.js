cf.router.regPage('lib/alert', function() {
  var $page;
  $page = this;
  $page.dom('#alertBtn').onClick(function() {
    cf.alert('這是 Alert 訊息<br/>\nby CaroFront');
  });
  return $page;
});
