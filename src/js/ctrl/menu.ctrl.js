
/* 有搭配 .html 的 ctrl, 觸發時會讀取 menu.ctrl.html 檔並寫入 template */
cf.regCtrl('menu', function(opt) {
  var $self, _background, _marginTop, _padding, cf, cssObj;
  if (opt == null) {
    opt = {};
  }
  $self = this;
  cf = $self.cf;
  _padding = '5px 10px';
  _background = '#000';
  _marginTop = 10;
  cssObj = {
    padding: _padding,
    background: _background,
    'margin-top': _marginTop
  };
  $self.dom('.menu1', function($menu1) {
    $menu1.css(cssObj);
    return $menu1.onClick(function() {
      return cf.router.goPage('index');
    });
  });
  $self.dom('.menu2', function($menu2) {
    $menu2.css(cssObj);
    return $menu2.onClick(function() {
      return cf.router.goPage('view?name=caro&age=100');
    });
  });
  return $self.css({
    position: 'fixed',
    top: 120,
    right: 0,
    background: cf.$body.css('background-color'),
    'padding-bottom': 10,
    'z-index': 100
  });
}, 'menu.ctrl');

cf.regDocReady(function(cf) {
  var $;
  $ = cf.require('$');
  $('<div>').addClass('menu').appendTo(cf.$body).menu();
});
