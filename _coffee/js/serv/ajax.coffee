###
客製化的 ajax 程式, 可使用假資料測試以及簡化呼叫方式
###
cf.regServ 'ajax', (cf) ->
  self = {}
  $ = cf.require('$')
  _cfg = cf.config('ajax')
  _isTest = cf.isLocal or _cfg.isTestMode
  _errMsg = _cfg.errMsg

  $loading = do ->
    $loading = $('<div/>').css(
      position: 'fixed'
      top: 0
      left: 0
      'background-color': 'rgba(0, 0, 0, 0.6)'
      width: '100%'
      height: '100%'
      'z-index': 9999
    )
    $loading.$msg = $('<div/>').css(
      'font-size': '1.5em'
      'text-align': 'center'
      color: '#fff'
    ).appendTo($loading)
    $loading.msgArr = ['Loading', 'Loading.', 'Loading..', 'Loading...']
    $loading.count = 0
    $loading

  generateAjaxOpt = (url, data, extendOpt) ->
    opt =
      url: url
      type: 'GET'
    if data
      opt.type = 'POST'
      opt.data = data
    cf.assign opt, extendOpt or {}

  showLoading = ->
    $loading.$msg.css
      'margin-top': cf.$window.height() / 2
    $loading.$msg.html($loading.msgArr[$loading.count])
    $loading.interval = setInterval ->
      $loading.count++
      $loading.count = 0 if $loading.count is $loading.msgArr.length
      $loading.$msg.html($loading.msgArr[$loading.count])
      return
    , 500
    $loading.appendTo(cf.$body).fadeIn()
    return

  hideLoading = ->
    setTimeout(->
      clearInterval $loading.interval
      $loading.fadeOut ->
        $loading.remove()
        return
    , 500)
    return

  ### 呼叫 ajax, 測試模式時會調用 opt.fakeResponse ###
  self.callAjax = (url, data, opt = {}) ->
    if _isTest
      jqxhr = {}
      jqxhr.done = jqxhr.success = (cb) ->
        fakeRes = opt.fakeResponse
        cb and cb(fakeRes)
        jqxhr
      ### 在測試模式時, error 和 err 不會執行 cb ###
      jqxhr.fail = jqxhr.error = -> return jqxhr
      return jqxhr
    ### 是否隱藏 loading 畫面 ###
    showLoading() unless opt.isHideLoading
    ajaxOpt = generateAjaxOpt(url, data, opt.ajaxOpt)
    errCb = ->
      ### 如果呼叫 ajax 發生錯誤, 顯示要 alert 的訊息 ###
      alert(_errMsg) if _errMsg
      return
    completeCb = ->
      hideLoading() unless opt.isHideLoading
      return
    jqxhr = $.ajax(ajaxOpt)
    ### jQuery 3.0 之後使用 done/fail 取代 success/error ###
    if jqxhr.done
      jqxhr.fail(errCb).always(completeCb)
    else
      jqxhr.error(errCb).complete(completeCb)
    jqxhr

  self