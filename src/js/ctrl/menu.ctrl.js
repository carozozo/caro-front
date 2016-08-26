
/* 有搭配 .html 的 ctrl, 觸發時會讀取 template/menu.ctrl.html 檔並寫入 template */
cf.regCtrl('menu', function() {
  var $libBtn, $libMenuItem, $libMenuItemBox, $menuBtnBox, $moduleBtn, $moduleMenuItem, $moduleMenuItemBox, $self, bgColorArr, cf, showItems, showMenu, tm;
  $self = this;
  cf = $self.cf;
  tm = cf.require('TweenMax');
  bgColorArr = cf.data('bgColorArr');
  showItems = function($items) {
    caro.forEach($items, function($item, i) {
      var animateObj, color, delay, direction, directionArr, distance;
      distance = 30;
      directionArr = [
        {
          x: -distance
        }, {
          x: distance
        }, {
          y: -distance
        }, {
          y: distance
        }
      ];
      direction = caro.randomPick(directionArr);
      delay = i * .05;
      animateObj = {
        opacity: 0,
        ease: Back.easeOut.config(1),
        delay: delay
      };
      animateObj = caro.assign(animateObj, direction);
      color = caro.randomPick(bgColorArr);
      $item.css({
        background: color
      });
      return tm.from($item, .3, animateObj);
    });
  };
  $menuBtnBox = $self.dom('#menuBtnBox');
  $libBtn = $menuBtnBox.dom('#libBtn');
  $moduleBtn = $menuBtnBox.dom('#moduleBtn');
  $libMenuItemBox = $self.dom('#libMenuItemBox').cfModal({
    befShow: function() {
      showItems($libMenuItem);
    }
  });
  $moduleMenuItemBox = $self.dom('#moduleMenuItemBox').cfModal({
    befShow: function() {
      showItems($moduleMenuItem);
    }
  });
  $libMenuItem = $libMenuItemBox.dom('.menuItem').mapDom(function($item) {
    return $item.onClick(function() {
      var id;
      id = $item.id();
      cf.router.goPage('lib/' + id);
      $libMenuItemBox.hideModal();
    });
  });
  $moduleMenuItem = $moduleMenuItemBox.dom('.menuItem').mapDom(function($item) {
    return $item.onClick(function() {
      var id;
      id = $item.id();
      cf.router.goPage('module/' + id);
      $moduleMenuItemBox.hideModal();
    });
  });
  showMenu = function(type) {
    if (type === 'lib') {
      $libMenuItemBox.showModal();
    } else {
      $moduleMenuItemBox.showModal();
    }
  };
  $libBtn.on('click', function() {
    showMenu('lib');
  });
  $moduleBtn.on('click', function() {
    showMenu();
  });
  return $self;
}, 'template/menu.ctrl.html');

cf.regDocReady(function(cf) {
  var $;
  $ = cf.require('$');
  $('#menuMain').menu();
});
