cf.router.regPage('index', function(cf) {
  var $, $page, caro, window;
  $page = this;
  window = cf.require('window');
  caro = cf.require('caro');
  $ = cf.require('$');
  return $page;
});

cf.regDocReady(function(cf) {
  var bgColorArr, titleSrcArr;
  bgColorArr = ['#7d7d7d', '#4f6a1a', '#8b181c', '#227d83', '#818124'];
  titleSrcArr = ['images/cf_title1.png', 'images/cf_title2.png', 'images/cf_title3.png', 'images/cf_title4.png', 'images/cf_title5.png'];
  cf.data('titleSrcArr', titleSrcArr);
  cf.data('bgColorArr', bgColorArr);
});
