
/* modal 視窗 */
cf.regModule('caroModal', function(opt) {
  var $, $background, $closeBtn, $container, $self, _index, _zIndex, backgroundStyle, basicStyle, cf, moduleData, style;
  if (opt == null) {
    opt = {};
  }
  $self = this;
  cf = $self.cf;
  $ = cf.require('$');
  moduleData = (function() {
    if (!cf.data('caroModal')) {
      cf.data('caroModal', {
        index: 1,
        zIndex: 900
      });
    }
    return cf.data('caroModal');
  })();
  _index = moduleData.index;
  _zIndex = moduleData.zIndex;
  basicStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    'z-index': ++_zIndex
  };
  style = opt.style || {};
  backgroundStyle = opt.backgroundStyle || {};
  $closeBtn = opt.$closeBtn;
  $background = (function($) {
    var $dom;
    $dom = $('<div></div>').attr('id', 'caro-modal-background' + _index).css({
      width: '100%',
      height: '100%',
      opacity: 0.8,
      'background-color': '#000'
    }).hide();
    return $dom.css(backgroundStyle).css(basicStyle);
  })($);
  $container = (function($) {
    var $dom;
    $dom = $('<div></div>').attr('id', 'caro-modal-container' + _index).css({
      width: '100%',
      height: '100%',
      overflow: 'auto',
      'text-align': 'center'
    }).hide();
    return $dom.css(style).css(basicStyle);
  })($);
  $('body').append($background).append($container);
  moduleData.index++;
  moduleData.zIndex += 2;

  /* 顯示視窗 */
  $self.showModal = function() {
    var $content;
    $content = $($self.html());
    $container.append($content);
    if ($closeBtn) {
      $container.append($closeBtn);
    }
    $background.show();
    $container.fadeIn();
  };

  /* 關閉視窗 */
  $self.closeModal = function() {
    $container.fadeOut(function() {
      if ($closeBtn) {
        $background.append($closeBtn);
      }
      $background.hide();
      $container.html('');
    });
  };
  return $self.hide();
});
