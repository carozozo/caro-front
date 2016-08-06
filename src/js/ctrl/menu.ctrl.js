
/* 有搭配 .html 的 ctrl, 觸發時會讀取 menu.ctrl.html 檔並寫入 template */
cf.regCtrl('menu', function() {
  var $menuBtn, $menuContent, $self, $window, _height, _moving, _router, cf, contentWidth, hideMenu, setPosition, showMenu, tm;
  $self = this;
  cf = $self.cf;
  tm = cf.require('TweenMax');
  $window = cf.$window;
  _router = cf.router;
  _height = 0;
  _moving = false;
  $menuContent = $self.dom('#menuContent');
  contentWidth = $menuContent.width();
  setPosition = function() {
    $self.css({
      top: ($window.height() - _height) / 2
    });
  };
  hideMenu = function() {
    if (_moving) {
      return;
    }
    _moving = true;
    tm.to($self, .3, {
      x: contentWidth,
      onComplete: function() {
        $menuBtn.fadeIn();
        _moving = false;
      }
    });
  };
  showMenu = function() {
    if (_moving) {
      return;
    }
    _moving = true;
    $menuBtn.hide();
    tm.to($self, .3, {
      x: 0,
      onComplete: function() {
        _moving = false;
      }
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
        return tm.to($item, .2, {
          width: itemWidth * 1.5,
          'background-color': '#eeeeee'
        });
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
  $menuBtn = $self.dom('#menuBtn').on('mouseenter', showMenu);
  $self.on('mouseleave', hideMenu);
  setPosition();
  hideMenu();
  $window.on('resize.menu', setPosition);
  return $self;
}, 'menu.ctrl');

cf.regDocReady(function(cf) {
  var $;
  $ = cf.require('$');
  $('<div>').addClass('menu').appendTo(cf.$body).menu();
});
