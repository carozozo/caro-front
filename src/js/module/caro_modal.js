
/* modal 視窗 */
cf.regModule('caroModal', function(opt) {
  var $, $background, $body, $inner, $outer, $self, _basicStyle, _index, _isClickClose, _zIndex, cf, moduleData;
  if (opt == null) {
    opt = {};
  }
  $self = this;
  cf = $self.cf;
  $body = cf.$body;
  $ = cf.require('$');

  /* 是否點選內容之外的部分就 close modal */
  _isClickClose = opt.isClickClose === false ? opt.isClickClose : true;
  moduleData = (function() {
    if (!cf.data('caroModal')) {
      cf.data('caroModal', {
        index: 1,
        zIndex: 99999
      });
    }
    return cf.data('caroModal');
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
    return $('<div></div>').attr('id', 'caro-modal-background' + _index).css({
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
    return $('<div></div>').attr('id', 'caro-modal-inner' + _index).css({
      width: selfWidth,
      'margin-left': 'auto',
      'margin-right': 'auto',
      position: 'relative',
      top: '50%',
      transform: 'translateY(-50%)'
    }).append($self);
  })($);
  $outer = (function($) {
    return $('<div></div>').attr('id', 'caro-modal-outer' + _index).css(_basicStyle).on('click', function(e) {
      if (!(_isClickClose && e.target === this)) {
        return;
      }
      return $self.closeModal();
    }).append($inner).hide();
  })($);
  $body.append($background).append($outer);
  moduleData.index++;
  moduleData.zIndex += 2;

  /* 顯示視窗 */
  $self.showModal = function() {
    $body.css({
      overflow: 'hidden'
    });
    $background.show();
    $outer.fadeIn();
  };

  /* 關閉視窗 */
  $self.closeModal = function() {
    $body.css({
      overflow: 'auto'
    });
    $outer.fadeOut(function() {
      $background.hide();
    });
  };
  return $self;
});
