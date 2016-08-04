cf.router.regPage('index', function(cf, $page) {
  var _tracking, caro, tl, tm, window;
  tm = cf.require('TweenMax');
  tl = cf.require('TimelineMax');
  window = cf.require('window');
  caro = cf.require('caro');
  _tracking = cf.tracking;
  $page.dom('.title', function($self) {
    return $self.caroAnimated('bounceInDown');
  });
  $page.dom('.content', function($self) {
    $self.hide();
    return setTimeout(function() {
      $self.show().caroAnimated('bounceInRight');
    }, 1000);
  });
  _tracking.page('index');
  return $page;
});
