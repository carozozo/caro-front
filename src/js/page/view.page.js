cf.router.regPage('view', function(cf, $page) {
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
    x: -100
  }, .3);
  setTimeout(function() {
    var searchObj;
    if (cf.data('view')) {
      return;
    }
    cf.data('view', true);
    searchObj = cf.router.parseUrlSearch();
    if (searchObj) {
      cf.alert(JSON.stringify(searchObj));
    }
  }, 1000);
  _tracking.page('view');
  return $page;
});
