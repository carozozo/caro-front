cf.router.regPage('module/cfScrollbar', function(cf, $page) {
  var $outer, bgColorArr;
  bgColorArr = cf.data('bgColorArr');
  $outer = $page.dom('#outer').css({
    height: 200
  });
  $page.dom('#inner1').css({
    height: 210,
    'background-color': bgColorArr[0]
  });
  $page.dom('#inner2').css({
    height: 210,
    'background-color': bgColorArr[1]
  });
  $outer.cfScrollbar();
  return $page;
});
