
/* 有搭配 .html 的 ctrl, 觸發時會讀取 menu.ctrl.html 檔並寫入 template */
cf.regCtrl('menu', function(opt) {
  var $self, $window, _router, cf, setPosition;
  if (opt == null) {
    opt = {};
  }
  $self = this;
  cf = $self.cf;
  _router = cf.router;
  $window = cf.$window;
  setPosition = function() {
    $self.css({
      top: ($window.height() - $self.height()) / 2
    });
  };
  $self.dom('.menu1', function($menu1) {
    return $menu1.onClick(function() {
      return _router.goPage('cf');
    });
  });
  $self.dom('.menu2', function($menu2) {
    return $menu2.onClick(function() {
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
