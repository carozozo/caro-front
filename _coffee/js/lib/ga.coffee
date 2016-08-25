###
客製化的 tracking for Google analytics
https://www.google.com.tw/intl/zh-TW_ALL/analytics/index.html
###
cf.regLib 'ga', (cf) ->
  self = {}
  window = cf.require('window')
  _cfg = cf.config('tracking')
  _isDownloadGa = _cfg.isDownloadGa
  _trace = cf.genTraceFn('ga')
  _trace.startTrace()

  ga = cf.require('ga')

  ### 發送 page view ###
  self.page = (pageName) ->
    pageName = pageName.trim()
    if _isDownloadGa
      _trace('Send ga pageView:', pageName)
      ga('send', 'pageview', pageName)
    else
      _trace('[NoTracking] Send ga pageView:', pageName)
    return

  ### 發送 event ###
  self.event = (category, action, label) ->
    action = action.trim()
    label = label.trim()
    category = category.trim()
    if _isDownloadGa
      _trace('Send ga event, category:', category, ', action:', action, ', label:', label)
      ga 'send', 'event', category, action, label
    else
      _trace('[NoTracking] Send ga event, category:', category, ', action:', action, ', label:', label)
    return

  self

cf.regDocReady((cf) ->
  _cfg = cf.config('ga')
  _gaId = _cfg.gaId
  window = cf.require('window')
  document = cf.require('document')
  _trace = cf.genTraceFn('ga')
  _trace.startTrace()

  downloadSdkFn = ->
    _trace 'Start download google analytics, id:', _gaId
      ((i, s, o, g, r, a, m) ->
        i['GoogleAnalyticsObject'] = r
        i[r] = i[r] or ->
            (i[r].q = i[r].q or []).push arguments

        i[r].l = 1 * new Date
        a = s.createElement(o)
        m = s.getElementsByTagName(o)[0]
        a.async = 1
        a.src = g
        m.parentNode.insertBefore a, m)(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga')
      ga('create', _gaId, 'auto')
    return

  downloadSdkFn() if _cfg.isDownloadGa
  return
)