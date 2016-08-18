cf.router.regPage('index', function(cf, $page) {
  var $, _tracking, caro, window;
  window = cf.require('window');
  caro = cf.require('caro');
  $ = cf.require('$');
  _tracking = cf.tracking;
  _tracking.page('index');
  return $page;
});

cf.regDocReady(function(cf) {
  var $, $header, $headerTitle, bgColorArr, titleSrcArr, tm;
  $ = cf.require('$');
  tm = cf.require('TweenMax');
  $header = $('header');
  $headerTitle = $('#headerTitle').dom();
  bgColorArr = ['#464646', '#354712', '#460c0f', '#123f49', '#3b3b00'];
  titleSrcArr = ['images/cf_title1.png', 'images/cf_title2.png', 'images/cf_title3.png', 'images/cf_title4.png', 'images/cf_title5.png'];
  $headerTitle.onClick(function() {
    cf.router.goPage('index');
  });
  cf.router.regPrePage(function() {
    var color;
    color = caro.randomPick(bgColorArr);
    tm.to($header, 1, {
      backgroundColor: color
    });
  });
  cf.data('titleSrcArr', titleSrcArr);
  cf.data('bgColorArr', bgColorArr);
});
