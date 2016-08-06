
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
      var backgroundColor, height, id, itemHeight, itemWidth, pageName;
      $item = $($item);
      itemWidth = $item.width();
      itemHeight = $item.height();
      backgroundColor = $item.css('background-color');
      id = $item.attr('id');
      pageName = id.replace('menu', '').toLowerCase();
      height = i * (itemHeight + 20);
      _height += height;
      $item.css({
        width: itemWidth
      });
      return $item.on('mouseenter', function() {
        var $next;
        tm.to($item, .2, {
          width: itemWidth * 1.5,
          'background-color': '#eeeeee'
        });
        return $next = $menuItem[i + 1];
      }).on('mouseleave', function() {
        return tm.to($item, .2, {
          width: itemWidth,
          'background-color': backgroundColor
        });
      }).on('click', function() {
        return _router.goPage(pageName);
      });
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
