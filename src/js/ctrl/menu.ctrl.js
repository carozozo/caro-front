
/* 有搭配 .html 的 ctrl, 觸發時會讀取 template/menu.ctrl.html 檔並寫入 template */
cf.regCtrl('menu', function() {
  var $libBtn, $menuBtnBox, $menuContent, $menuLibContent, $menuModuleContent, $moduleBtn, $self, cf, hideMenu, showMenu, tm;
  $self = this;
  cf = $self.cf;
  tm = cf.require('TweenMax');
  $menuBtnBox = $self.dom('#menuBtnBox');
  $libBtn = $menuBtnBox.dom('#libBtn');
  $moduleBtn = $menuBtnBox.dom('#moduleBtn');
  $menuContent = $self.dom('.menuContent');
  $menuLibContent = $self.dom('#menuLibContent');
  $menuModuleContent = $self.dom('#menuModuleContent');
  $menuLibContent.$$originalWidth = $menuLibContent.width();
  $menuModuleContent.$$originalWidth = $menuModuleContent.width();
  $menuLibContent.hide();
  $menuModuleContent.hide();
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
    $menuBtnBox.hide();
    $content = type === 'lib' ? $menuLibContent : $menuModuleContent;
    $content.show();
    tm.from($content, .5, {
      x: $menuLibContent.$$originalWidth
    });
  };
  hideMenu = function() {
    $menuBtnBox.fadeIn();
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
  return $self;
}, 'template/menu.ctrl.html');

cf.regDocReady(function(cf) {
  var $;
  $ = cf.require('$');
  $('#menuMain').menu();
});
