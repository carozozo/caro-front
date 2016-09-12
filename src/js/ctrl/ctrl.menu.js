
/* 有搭配 .html 的 ctrl, 觸發時會讀取 template/ctrl/menu.html 檔並寫入 template */
cf.regCtrl('menu', function() {
  var $libBtn, $libBtnOuter, $libMenuItemBox, $libMenuItems, $menuBtnBox, $moduleBtn, $moduleBtnOuter, $moduleMenuItemBox, $moduleMenuItems, $self, $window, bgColorArr, caro, dropAllItems, hideMenu, setMenuBtn, setMenuItem, showItems, showMenu, tm;
  $self = this;
  $window = cf.$window;
  caro = cf.require('caro');
  tm = cf.require('TweenMax');
  bgColorArr = cf.data('bgColorArr');
  showItems = function($items) {
    caro.forEach($items, function($item, i) {
      var color, delay;
      delay = i * .05;
      color = caro.randomPick(bgColorArr);
      $item.css({
        background: color
      });
      return tm.fromTo($item, 1, {
        scale: caro.randomNum(1),
        opacity: 0,
        x: caro.randomInt(200, -200),
        y: caro.randomInt(200, -200)
      }, {
        scale: 1,
        opacity: 1,
        bezier: [
          {
            x: caro.randomInt(200, -200),
            y: caro.randomInt(200, -200)
          }, {
            x: 0,
            y: 0
          }
        ],
        ease: Back.easeOut.config(1),
        delay: delay
      });
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
    var $items;
    $items = type === 'lib' ? $libMenuItems : $moduleMenuItems;
    caro.forEach($items, function($item) {
      var delay;
      delay = Math.random() * .3;
      tm.to($item, .3, {
        opacity: 0,
        y: 500,
        delay: delay
      });
    });
    setTimeout(cb, 500);
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
      var id;
      dropAllItems(type, function() {
        return hideMenu();
      });
      id = $item.id();
      cf.router.goPage(type + '/' + id);
    });
  };
  setMenuBtn = function($btn) {
    tm.set($btn, {
      transformPerspective: 600,
      transformOriginal: '100% 50%'
    });
    $btn.on('mouseover', function() {
      return tm.to($btn, .2, {
        rotationY: -30,
        x: -10
      });
    }).on('mouseleave', function() {
      return tm.to($btn, .1, {
        rotationY: 0,
        x: 0
      });
    });
  };
  $menuBtnBox = $self.dom('#menuBtnBox');
  $libBtnOuter = $menuBtnBox.dom('#libBtnOuter', function($libBtnOuter) {
    return setMenuBtn($libBtnOuter);
  });
  $moduleBtnOuter = $menuBtnBox.dom('#moduleBtnOuter', function($moduleBtnOuter) {
    return setMenuBtn($moduleBtnOuter);
  });
  $libBtn = $menuBtnBox.dom('#libBtn');
  $moduleBtn = $menuBtnBox.dom('#moduleBtn');
  $libMenuItemBox = $self.dom('#libMenuItemBox').cfModal();
  $moduleMenuItemBox = $self.dom('#moduleMenuItemBox').cfModal();
  $libMenuItems = $libMenuItemBox.dom('.menuItem').coverToArr(function($item) {
    return setMenuItem($item, 'lib');
  });
  $moduleMenuItems = $moduleMenuItemBox.dom('.menuItem').coverToArr(function($item) {
    return setMenuItem($item, 'module');
  });
  $libBtn.on('click', function() {
    showMenu('lib');
  });
  $moduleBtn.on('click', function() {
    showMenu();
  });
  cf.router.regAftPage(function() {
    return $window.on('scroll', function() {
      var pageHeight, scrollTop;
      pageHeight = cf.router.$page.height();
      scrollTop = $window.scrollTop();
      tm.to([$libBtnOuter, $moduleBtnOuter], 1, {
        y: scrollTop / pageHeight * 50
      });
    });
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
