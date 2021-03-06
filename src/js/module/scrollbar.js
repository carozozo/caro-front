
/*
自訂捲軸樣式, 客製化外掛 jquery.mCustomScrollbar 使用方式
Depend on jquery.mCustomScrollbar
 */
cf.regModule('cfScrollbar', function(styleOpt, scrollBarOpt) {
  var $self, _trace, barCss, callbacksOpt, key, lineCss, mainOpt, name, onCreateFn, themeName, val;
  if (styleOpt == null) {
    styleOpt = {};
  }
  if (scrollBarOpt == null) {
    scrollBarOpt = {};
  }

  /* styleOpt = 樣式參數 */

  /* scrollBarOpt = 外掛 mCustomScrollbar 參數 */
  $self = this;
  _trace = cf.genTraceFn('cfScrollbar');

  /* 捲軸名稱 */
  name = styleOpt.name || '';

  /* 捲軸按鈕樣式 */
  barCss = styleOpt.barCss;

  /* 捲軸樣式 */
  lineCss = styleOpt.lineCss;
  if (scrollBarOpt.theme && (barCss || lineCss)) {
    _trace.err('customScrollbar 無法自訂樣式');
  }

  /* 替換 onCreate */
  onCreateFn = null;
  callbacksOpt = scrollBarOpt.callbacks || {};
  (function() {
    if (callbacksOpt.onCreate) {
      onCreateFn = callbacksOpt.onCreate;
      delete callbacksOpt.onCreate;
    }
  })();
  themeName = name ? 'my-theme-' + name : 'my-theme';
  mainOpt = {
    scrollbarPosition: 'outside',
    theme: themeName
  };
  for (key in scrollBarOpt) {
    val = scrollBarOpt[key];
    mainOpt[key] = val;
  }
  callbacksOpt.onCreate = function() {
    if (onCreateFn) {
      onCreateFn();
    }
    if (barCss) {
      $('.mCS-' + themeName + '.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar').css(barCss);
    }
    if (lineCss) {
      $('.mCS-' + themeName + '.mCSB_scrollTools .mCSB_draggerRail').css(lineCss);
    }
    $('.mCSB_scrollTools').css({
      opacity: 1
    });
  };
  mainOpt.callbacks = callbacksOpt;
  $self.mCustomScrollbar(mainOpt);
  return $self;
});
