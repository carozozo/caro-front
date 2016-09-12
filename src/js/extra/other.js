cf.regDocReady(function(cf) {
  var $, $colors, bgColorArr, titleSrcArr;
  $ = cf.require('$');
  $colors = $('#colors');
  bgColorArr = [];
  $colors.find('div').each(function(i, ele) {
    var $div;
    $div = $(ele);
    return bgColorArr.push($div.css('color'));
  });
  titleSrcArr = ['images/cf_title1.png', 'images/cf_title2.png', 'images/cf_title3.png', 'images/cf_title4.png', 'images/cf_title5.png'];
  cf.data('titleSrcArr', titleSrcArr);
  cf.data('bgColorArr', bgColorArr);
}, 1);
