cf.router.regPage('module/cfScroll', function(cf) {
  var $, $innerArr, $outer, $page, bgColorArr, caro, setInner;
  $page = this;
  caro = cf.require('caro');
  $ = cf.require('$');
  setInner = function($inner, index, color) {
    $inner.css({
      width: '97%',
      height: 100,
      color: '#e5e5e5',
      'background-color': color,
      'text-align': 'center',
      'padding-top': 20
    });
    return $inner.append('<h2>' + index + '</h2>');
  };
  $outer = $page.dom('#outer').css({
    height: 180
  });
  bgColorArr = cf.data('bgColorArr');
  $innerArr = [];
  caro.forEach(bgColorArr, function(color, i) {
    var $inner, index;
    index = i + 1;
    $inner = $page.dom('#inner' + index);
    if (!$inner.length) {
      return;
    }
    setInner($inner, index, color);
    $innerArr.push($inner);
  });
  $outer.cfScroll($innerArr);
  $page.dom('#scrollToBtn1').onClick(function() {
    $outer.scrollTo(1);
  });
  $page.dom('#scrollToBtn2').onClick(function() {
    $outer.scrollTo(3);
  });
  $page.dom('#scrollNextBtn').onClick(function() {
    $outer.scrollNext();
  });
  $page.dom('#scrollPrevBtn').onClick(function() {
    $outer.scrollPrev();
  });
  return $page;
});
