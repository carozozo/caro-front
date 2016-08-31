cf.router.regPage('module/cfCircleShow', function(cf, $page) {
  var $circleDom, $currentIndex, $demo1, bgColorArr;
  $page = this;
  bgColorArr = cf.data('bgColorArr');
  $demo1 = $page.dom('#demo1').css({
    position: 'relative',
    'margin-top': 20,
    'margin-left': 20,
    height: 180
  });
  $circleDom = $page.dom('.circleDom').coverToArr(function($dom, i) {
    $dom.css({
      width: 100,
      height: 120,
      background: bgColorArr[i % bgColorArr.length]
    });
  });
  $currentIndex = $page.dom('#currentIndex');
  $demo1.cfCircleShow($circleDom, {
    radios: 120,
    degreeTop: 20,
    minScale: .8,
    cb: function($target, i) {
      $currentIndex.html(i);
    }
  });
  $page.dom('#nextBtn').onClick(function() {
    $demo1.stopPlay();
    $demo1.next();
  });
  $page.dom('#prevBtn').onClick(function() {
    $demo1.stopPlay();
    $demo1.prev();
  });
  $page.dom('#autoPlay1Btn').onClick(function() {
    $demo1.stopPlay();
    $demo1.autoPlay();
  });
  $page.dom('#autoPlay2Btn').onClick(function() {
    $demo1.stopPlay();
    $demo1.autoPlay(1000, false);
  });
  $page.dom('#stopPlayBtn').onClick(function() {
    $demo1.stopPlay();
  });
  return $page;
});
