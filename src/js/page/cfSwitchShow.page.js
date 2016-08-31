cf.router.regPage('module/cfSwitchShow', function(cf, $page) {
  var $innerArr1, $innerArr2, $outer1, $outer2, $selectType, bgColorArr, setInner;
  $page = this;
  setInner = function($inner, index, color) {
    $inner.css({
      width: '18%',
      height: 100,
      color: '#e5e5e5',
      'background-color': color,
      'text-align': 'center',
      'padding-top': 20
    });
    return $inner.append('<h2>' + index + '</h2>');
  };
  $outer1 = $page.dom('#outer1').css({
    height: 120,
    position: 'relative'
  });
  $outer2 = $page.dom('#outer2').css({
    height: 120,
    position: 'relative'
  });
  bgColorArr = cf.data('bgColorArr');
  $innerArr1 = [];
  $innerArr2 = [];
  $page.dom('.inner1').eachDom(function($inner, i) {
    var color, index;
    index = i + 1;
    color = bgColorArr[i];
    setInner($inner, index, color);
    $innerArr1.push($inner);
    return $inner.css({
      position: 'absolute',
      top: 0,
      left: 0
    });
  });
  $page.dom('.inner2').eachDom(function($inner, i) {
    var color, index;
    index = i + 1;
    color = bgColorArr[i];
    setInner($inner, index, color);
    $innerArr2.push($inner);
    return $inner.css({
      display: 'inline-block'
    });
  });
  $outer1.cfSwitchShow($innerArr1);
  $outer2.cfSwitchShow($innerArr2);
  $selectType = $page.dom('#selectType');
  $page.dom('#nextShowBtn').onClick(function() {
    var selectType;
    selectType = $selectType.val();
    $outer1.showNext(selectType);
    $outer2.showNext(selectType);
  });
  $page.dom('#prevShowBtn').onClick(function() {
    var selectType;
    selectType = $selectType.val();
    $outer1.showPrev(selectType);
    $outer2.showPrev(selectType);
  });
  return $page;
});
