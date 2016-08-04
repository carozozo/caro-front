cf.router.regPage('index', function(cf, $page) {
  var $content, $title, _tracking, caro, tm, window;
  tm = cf.require('TweenMax');
  window = cf.require('window');
  caro = cf.require('caro');
  _tracking = cf.tracking;
  $title = $page.dom('.title');
  $content = $page.dom('.content', function($content) {
    $content.demo2Ctrl();
  });
  tm.staggerFrom([$title, $content], .5, {
    opacity: 0,
    y: -50
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
  }, 1000);
  _tracking.page('index');
  return $page;
});
