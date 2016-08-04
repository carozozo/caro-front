cf.router.regPage('index', function(cf, $page) {
  var $subContent, $title, _tracking, caro, tl, tl1, tm, window;
  tm = cf.require('TweenMax');
  tl = cf.require('TimelineMax');
  window = cf.require('window');
  caro = cf.require('caro');
  _tracking = cf.tracking;
  $title = $page.dom('.title');
  $subContent = $page.dom('.subContent', function($subContent) {
    $subContent.demo2Ctrl();
  });
  tl1 = new tl();
  tl1.from($title, .5, {
    opacity: 0,
    y: -50
  }).staggerFrom($subContent, .5, {
    opacity: 0,
    x: -50
  }, .3);
  setTimeout(function() {
    var search;
    if (cf.data('index')) {
      return;
    }
    cf.data('index', true);
    search = cf.router.getSearchByHash();
    if (search) {
      cf.alert(search);
    }
  }, 1500);
  _tracking.page('index');
  return $page;
});
