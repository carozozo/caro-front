
/* 有搭配 .html 的 ctrl, 觸發時會讀取 template/ctrl/menu.html 檔並寫入 template */
cf.regCtrl('menu', function() {
  var $libBtn, $libBtnOuter, $libMenuItemBox, $libMenuItems, $menuBtnBox, $moduleBtn, $moduleBtnOuter, $moduleMenuItemBox, $moduleMenuItems, $self, bgColorArr, cf, dropAllItems, hideMenu, setMenuItem, showItems, showMenu, tm;
  $self = this;
  cf = $self.cf;
  tm = cf.require('TweenMax');
  bgColorArr = cf.data('bgColorArr');
  showItems = function($items) {
    caro.forEach($items, function($item, i) {
      var animateObj, color, delay, direction, directionArr, distance;
      tm.set($item, {
        y: 0
      });
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
  showMenu = function(type) {
    if (type === 'lib') {
      $libMenuItemBox.showModal({
        befShow: function() {
          showItems($libMenuItems);
        }
      });
    } else {
      $moduleMenuItemBox.showModal({
        befShow: function() {
          showItems($moduleMenuItems);
        }
      });
    }
  };
  hideMenu = function() {
    $libMenuItemBox.hideModal();
    return $moduleMenuItemBox.hideModal();
  };
  dropAllItems = function(type, cb) {
    var $items, count;
    $items = type === 'lib' ? $libMenuItems : $moduleMenuItems;
    count = 0;
    caro.forEach($items, function($item) {
      var delay;
      delay = Math.random() * .3;
      tm.to($item, .3, {
        y: cf.$window.height(),
        delay: delay,
        onComplete: function() {
          if (++count === $items.length) {
            cb();
          }
        }
      });
    });
  };
  setMenuItem = function($item, type) {
    $item.on('mouseover', function() {
      var roataionArr, rotation, transformOrigin;
      roataionArr = [5, -5, 3, -3];
      rotation = caro.randomPick(roataionArr);
      transformOrigin = rotation > 0 ? '20% 20%' : '80% 20%';
      return tm.to($item, .3, {
        rotation: rotation,
        transformOrigin: transformOrigin
      });
    }).on('mouseleave', function() {
      return tm.to($item, .3, {
        rotation: 0
      });
    });
    $item.onClick(function() {
      dropAllItems(type, function() {
        var id;
        id = $item.id();
        hideMenu();
        return cf.router.goPage(type + '/' + id);
      });
    });
  };
  $menuBtnBox = $self.dom('#menuBtnBox');
  $libBtnOuter = $menuBtnBox.dom('#libBtnOuter');
  $moduleBtnOuter = $menuBtnBox.dom('#moduleBtnOuter');
  $libBtn = $menuBtnBox.dom('#libBtn');
  $moduleBtn = $menuBtnBox.dom('#moduleBtn');
  $libMenuItemBox = $self.dom('#libMenuItemBox').cfModal();
  $moduleMenuItemBox = $self.dom('#moduleMenuItemBox').cfModal();
  $libMenuItems = $libMenuItemBox.dom('.menuItem').mapDom(function($item) {
    return setMenuItem($item, 'lib');
  });
  $moduleMenuItems = $moduleMenuItemBox.dom('.menuItem').mapDom(function($item) {
    return setMenuItem($item, 'module');
  });
  $libBtn.on('click', function() {
    showMenu('lib');
  });
  $moduleBtn.on('click', function() {
    showMenu();
  });
  tm.staggerFrom([$libBtnOuter, $moduleBtnOuter], .5, {
    right: -$libBtnOuter.width() - 20,
    ease: Back.easeOut.config(1.5),
    delay: 1
  }, .3);
  return $self;
}, 'template/ctrl/menu.html');

cf.regDocReady(function(cf) {
  var $;
  $ = cf.require('$');
  $('#menuMain').menu();
});
