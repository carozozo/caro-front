cf.router.regPage('index', function(cf, $page) {
  var $content, $title, _tracking, caro, tl, tl1, tm, window;
  tm = cf.require('TweenMax');
  tl = cf.require('TimelineMax');
  window = cf.require('window');
  caro = cf.require('caro');
  _tracking = cf.tracking;
  $title = $page.dom('.title');
  $content = $page.dom('.content', function($content) {
    $content.demo2Ctrl();
  });
  tl1 = new tl();
  tl1.staggerFrom([$title, $content], .5, {
    opacity: 0,
    y: -100
  }, .5);
  _tracking.page('index');
  return $page;
});
