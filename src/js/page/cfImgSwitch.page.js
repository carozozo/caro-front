cf.router.regPage('module/cfImgSwitch', function(cf) {
  var $img, $page, titleSrcArr;
  $page = this;
  titleSrcArr = cf.data('titleSrcArr');
  $page.dom('#imgBox').css({
    width: 340,
    padding: 20,
    margin: '0 auto'
  });
  $img = $page.dom('#img').cfImgSwitch(titleSrcArr).src(titleSrcArr[0]);
  $page.dom('#switchImgBtn').onClick(function() {
    $img.switchImg();
  });
  $page.dom('#switchImg1Btn').onClick(function() {
    $img.switchImg(1);
  });
  $page.dom('#autoSwitchBtn').onClick(function() {
    $img.autoSwitch();
  });
  $page.dom('#stopSwitchBtn').onClick(function() {
    $img.stopSwitch();
  });
  return $page;
});
