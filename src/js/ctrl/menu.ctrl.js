
/* 有搭配 .html 的 ctrl, 觸發時會讀取 menu.ctrl.html 檔並寫入 template */
cf.regCtrl('menu', function() {
  var $self, $window, _height, _router, cf, setPosition, tm;
  $self = this;
  cf = $self.cf;
  tm = cf.require('TweenMax');
  $window = cf.$window;
  _router = cf.router;
  _height = 0;
  setPosition = function() {
    $self.css({
      top: ($window.height() - _height) / 2
    });
  };
  $self.dom('.menuItem', function($menuItem) {
    return $menuItem.each(function(i, $item) {
      var backgroundColor, height, itemHeight, itemWidth;
      $item = $($item);
      itemWidth = $item.width();
      itemHeight = $item.height();
      backgroundColor = $item.css('background-color');
      height = i * (itemHeight + 20);
      _height += height;
      $item.css({
        top: i * (itemHeight + 20)
      });
      return $item.on('mouseenter', function() {
        return tm.to($item, .2, {
          width: itemWidth * 1.5,
          'background-color': '#eeeeee'
        });
      }).on('mouseleave', function() {
        return tm.to($item, .2, {
          width: itemWidth,
          'background-color': backgroundColor
        });
      });
    });
  });
  $self.dom('.menuCf', function($menu) {
    return $menu.onClick(function() {
      return _router.goPage('cf');
    });
  });
  $self.dom('.menuAjax', function($menu) {
    return $menu.onClick(function() {
      return _router.goPage('ajax');
    });
  });
  $self.dom('.menuRouter', function($menu) {
    return $menu.onClick(function() {
      return _router.goPage('router?name=caro&age=100');
    });
  });
  setPosition();
  $window.on('resize.menu', setPosition);
  return $self;
}, 'menu.ctrl');

cf.regDocReady(function(cf) {
  var $;
  $ = cf.require('$');
  $('<div>').addClass('menu').appendTo(cf.$body).menu();
});
