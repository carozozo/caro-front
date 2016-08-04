
/* 有搭配 .html 的 ctrl */
cf.regCtrl('demoCtrl', function(opt) {
  var $self, _background, _display, _marginLeft, _padding, cf, cssObj;
  if (opt == null) {
    opt = {};
  }
  $self = this;
  cf = $self.cf;
  _padding = '5px 10px';
  _display = 'inline-block';
  _background = '#000';
  _marginLeft = 10;
  cssObj = {
    padding: _padding,
    position: _display,
    background: _background,
    display: _display,
    'margin-left': _marginLeft
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
      return cf.router.goPage('view');
    });
  });
  return $self.css({
    width: '100%'
  });
}, 'demo.ctrl');

cf.regDocReady(function(cf) {
  var $;
  $ = cf.require('$');
  $('<div>').addClass('menu').appendTo(cf.$body).demoCtrl();
});
