
/* 有搭配 .html 的 ctrl, 觸發時會讀取 menu.ctrl.html 檔並寫入 template */
cf.regCtrl('menu', function() {
  var $downLibBtn, $downModuleBtn, $libBtn, $menuBtn, $menuContent, $menuItemBox, $menuLibContent, $menuLibItemBox, $menuLibItemInnerBox, $menuModuleContent, $menuModuleItemBox, $menuModuleItemInnerBox, $moduleBtn, $self, $upLibBtn, $upModuleBtn, _menuItemBoxHeight, _menuScrollStep, _minLibTop, _minModuleTop, cf, hideMenu, showMenu, tm;
  $self = this;
  cf = $self.cf;
  tm = cf.require('TweenMax');

  /* menu 列表最大高度 */
  _menuItemBoxHeight = 350;

  /* 每次捲動高度 */
  _menuScrollStep = _menuItemBoxHeight;
  $menuBtn = $self.dom('.menuBtn');
  $libBtn = $self.dom('#libBtn');
  $moduleBtn = $self.dom('#moduleBtn');
  $menuContent = $self.dom('.menuContent');
  $menuItemBox = $self.dom('.menuItemBox');
  $menuLibItemBox = $self.dom('#menuLibItemBox');
  $menuLibItemInnerBox = $menuLibItemBox.find('.innerBox');
  $menuLibItemInnerBox.$$top = 0;
  $menuLibContent = $self.dom('#menuLibContent');
  $upLibBtn = $self.dom('#upLibBtn');
  $downLibBtn = $self.dom('#downLibBtn');
  $menuLibItemBox.$$height = $menuLibItemBox.height();
  _minLibTop = _menuItemBoxHeight - $menuLibItemBox.$$height - 5;
  $menuModuleItemBox = $self.dom('#menuModuleItemBox');
  $menuModuleItemInnerBox = $menuModuleItemBox.find('.innerBox');
  $menuModuleItemInnerBox.$$top = 0;
  $menuModuleContent = $self.dom('#menuModuleContent');
  $upModuleBtn = $self.dom('#upModuleBtn');
  $downModuleBtn = $self.dom('#downModuleBtn');
  $menuModuleItemBox.$$height = $menuModuleItemBox.height();
  _minModuleTop = _menuItemBoxHeight - $menuModuleItemBox.$$height - 5;
  if (_minLibTop > -1) {
    $upLibBtn.hide();
    $downLibBtn.hide();
  }
  if (_minModuleTop > -1) {
    $upModuleBtn.hide();
    $downModuleBtn.hide();
  }
  $menuItemBox.css({
    'max-height': _menuItemBoxHeight,
    overflow: 'hidden'
  });
  $menuLibContent.hide();
  $menuModuleContent.hide();
  $menuLibContent.$$width = $menuLibContent.width();
  $menuModuleContent.$$width = $menuModuleContent.width();
  $menuLibContent.dom('.menuItem').eachDom(function($item) {
    return $item.onClick(function() {
      var id;
      id = $item.id();
      cf.router.goPage('lib/' + id);
    });
  });
  $menuModuleContent.dom('.menuItem').eachDom(function($item) {
    return $item.onClick(function() {
      var id;
      id = $item.id();
      cf.router.goPage('module/' + id);
    });
  });
  showMenu = function(type) {
    var $content;
    $menuBtn.hide();
    $content = type === 'lib' ? $menuLibContent : $menuModuleContent;
    $content.show();
    tm.from($content, .5, {
      x: $menuLibContent.$$width
    });
  };
  hideMenu = function() {
    $menuBtn.fadeIn();
    $menuContent.hide();
  };
  $libBtn.on('mouseenter', function() {
    return showMenu('lib');
  });
  $moduleBtn.on('mouseenter', function() {
    return showMenu();
  });
  $menuContent.on('mouseleave', function() {
    return hideMenu();
  });
  $upLibBtn.on('click', function() {
    var newTop;
    newTop = $menuLibItemInnerBox.$$top + _menuScrollStep;
    if (newTop > 0) {
      newTop = 0;
    }
    $menuLibItemInnerBox.$$top = newTop;
    return tm.to($menuModuleItemInnerBox, 1, {
      y: newTop
    });
  });
  $downLibBtn.on('click', function() {
    var newTop;
    newTop = $menuLibItemInnerBox.$$top - _menuScrollStep;
    if (newTop < _minLibTop) {
      newTop = _minLibTop;
    }
    $menuLibItemInnerBox.$$top = newTop;
    return tm.to($menuLibItemInnerBox, 1, {
      y: newTop
    });
  });
  $upModuleBtn.on('click', function() {
    var newTop;
    newTop = $menuModuleItemInnerBox.$$top + _menuScrollStep;
    if (newTop > 0) {
      newTop = 0;
    }
    $menuModuleItemInnerBox.$$top = newTop;
    return tm.to($menuModuleItemInnerBox, 1, {
      y: newTop
    });
  });
  $downModuleBtn.on('click', function() {
    var newTop;
    newTop = $menuModuleItemInnerBox.$$top - _menuScrollStep;
    if (newTop < _minModuleTop) {
      newTop = _minModuleTop;
    }
    $menuModuleItemInnerBox.$$top = newTop;
    return tm.to($menuModuleItemInnerBox, 1, {
      y: newTop
    });
  });
  return $self;
}, 'template/menu.ctrl.html');

cf.regDocReady(function(cf) {
  var $;
  $ = cf.require('$');
  $('#menuMain').menu();
});
