cf.router.regPage('module/cfJumpNum', function() {
  var $jumNum, $page;
  $page = this;
  $jumNum = $page.dom('#jumpNum').cfJumpNum();
  $page.dom('#jumpNumBtn').onClick(function() {
    $jumNum.intervalNum(1920);
  });
  $page.dom('#addNumBtn').onClick(function() {
    $jumNum.intervalAddNm(2015, {
      range: 300
    });
  });
  return $page;
});
