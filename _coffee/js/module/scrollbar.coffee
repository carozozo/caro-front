###
自訂捲軸樣式, 客製化外掛 jquery.mCustomScrollbar 使用方式
Depend on jquery.mCustomScrollbar
###
cf.regModule 'cfScrollbar', (styleOpt = {}, scrollBarOpt = {}) ->
  ### styleOpt = 樣式參數 ###
  ### scrollBarOpt = 外掛 mCustomScrollbar 參數 ###
  $self = @
  _trace = cf.genTraceFn('cfScrollbar')

  ### 捲軸名稱 ###
  name = styleOpt.name or ''
  ### 捲軸按鈕樣式 ###
  barCss = styleOpt.barCss
  ### 捲軸樣式 ###
  lineCss = styleOpt.lineCss
  _trace.err 'customScrollbar 無法自訂樣式' if scrollBarOpt.theme and (barCss or lineCss)

  ### 替換 onCreate ###
  onCreateFn = null
  callbacksOpt = scrollBarOpt.callbacks or {}
  do ->
    if callbacksOpt.onCreate
      onCreateFn = callbacksOpt.onCreate
      delete callbacksOpt.onCreate
    return
  themeName = if name then 'my-theme-' + name else 'my-theme'
  mainOpt =
    scrollbarPosition: 'outside'
    theme: themeName
  for key, val of scrollBarOpt
    mainOpt[key] = val
  callbacksOpt.onCreate = ->
    onCreateFn() if onCreateFn
    $('.mCS-' + themeName + '.mCSB_scrollTools .mCSB_dragger .mCSB_dragger_bar').css barCss if barCss
    $('.mCS-' + themeName + '.mCSB_scrollTools .mCSB_draggerRail').css lineCss if lineCss
    $('.mCSB_scrollTools').css opacity: 1
    return
  mainOpt.callbacks = callbacksOpt
  $self.mCustomScrollbar mainOpt
  $self