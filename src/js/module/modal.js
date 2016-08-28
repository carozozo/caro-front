
/*
modal 視窗
 */
cf.regModule('cfModal', function(opt) {
  var $, $background, $body, $inner, $outer, $self, $window, _aftHide, _aftShow, _basicStyle, _befHide, _befShow, _index, _isClickClose, _isEscClose, _zIndex, cf, moduleData;
  if (opt == null) {
    opt = {};
  }
  $self = this;
  cf = $self.cf;
  $body = cf.$body;
  $window = cf.$window;
  $ = cf.require('$');

  /* 是否點選內容之外的部分就 close modal */
  _isClickClose = opt.isClickClose === false ? false : true;

  /* 是否按下 esc 鍵 close modal */
  _isEscClose = opt.isEscClose === false ? false : true;

  /* 顯示視窗之前觸發的 cb, return false 則不顯示 */
  _befShow = opt.befShow;

  /* 顯示視窗之後觸發的 cb */
  _aftShow = opt.aftShow;

  /* 關閉視窗之前觸發的 cb, return false 則不關閉 */
  _befHide = opt.befHide;

  /* 關閉視窗之後觸發的 cb */
  _aftHide = opt.aftHide;
  moduleData = (function() {
    if (!cf.data('cfModal')) {
      cf.data('cfModal', {
        index: 1,
        zIndex: 99999
      });
    }
    return cf.data('cfModal');
  })();
  _index = moduleData.index;
  _zIndex = moduleData.zIndex;
  _basicStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    'z-index': ++_zIndex
  };
  $background = (function($) {
    return $('<div></div>').attr('id', 'cf-modal-background' + _index).css({
      opacity: 0.8,
      'background-color': '#000'
    }).css(_basicStyle).hide();
  })($);
  $inner = (function($) {
    var selfWidth;
    selfWidth = $self.clone().appendTo('body').wrap('<div style="display: none"></div>').css('width') || $self.width();
    $self.css({
      width: '100%'
    });
    return $('<div></div>').attr('id', 'cf-modal-inner' + _index).css({
      width: selfWidth,
      'margin-left': 'auto',
      'margin-right': 'auto',
      position: 'relative',
      top: '50%',
      transform: 'translateY(-50%)'
    }).append($self);
  })($);
  $outer = (function($) {
    return $('<div></div>').attr('id', 'cf-modal-outer' + _index).css(_basicStyle).on('click', function(e) {
      if (!(_isClickClose && e.target === this)) {
        return;
      }
      return $self.hideModal();
    }).append($inner).hide();
  })($);
  $body.append($background).append($outer);
  moduleData.index++;
  moduleData.zIndex += 2;

  /* 顯示視窗 */
  $self.showModal = function(opt) {
    var aftShow, befShow;
    if (opt == null) {
      opt = {};
    }
    befShow = opt.befShow;
    aftShow = opt.aftShow;
    if (befShow && befShow() === false) {
      return;
    }
    if (_befShow && _befShow() === false) {
      return;
    }
    $body.css({
      overflow: 'hidden'
    });
    $background.show();
    $outer.fadeIn(function() {
      aftShow && aftShow() === false;
      return _aftShow && _aftShow();
    });
  };

  /* 關閉視窗 */
  $self.hideModal = function(opt) {
    var aftHide, befHide;
    if (opt == null) {
      opt = {};
    }
    befHide = opt.befHide;
    aftHide = opt.aftHide;
    if (befHide && befHide() === false) {
      return;
    }
    if (_befHide && _befHide() === false) {
      return;
    }
    $body.css({
      overflow: 'auto'
    });
    $background.fadeOut();
    $outer.fadeOut(function() {
      aftHide && aftHide();
      _aftHide && _aftHide();
    });
  };
  $window.on('keyup.cfModal' + _index, function() {
    if (_isEscClose) {
      $self.hideModal();
    }
  });
  return $self;
});
