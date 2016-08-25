###
客製化的 tracking for Google tag manager
https://www.google.com/analytics/tag-manager/
###
cf.regServ 'gtm', (cf) ->
  self = {}
  window = cf.require('window')
  document = cf.require('document')
  _cfg = cf.config('gtm')
  _isDownloadGtm = _cfg.isDownloadGtm
  _trace = cf.genTraceFn('gtm')
  _trace.startTrace()

  self.page = (pageName) ->
    pageName = pageName.trim()
    if _isDownloadGtm
      _trace('Send gtm pageView:', pageName)
      dataLayer.push
        'event': 'VirtualPageview'
        'virtualPageURL': pageName
        'virtualPageTitle': document.title
    else
      _trace('[NoTracking] Send gtm pageView:', pageName)
    return

  self.event = (category, action, label) ->
    category = category.trim()
    action = action.trim()
    label = label.trim()
    if _isDownloadGtm
      _trace('Send gtm event, category:', category, ', action:', action, ', label:', label)
      dataLayer.push
        'event': 'VirtualSend'
        'virtualCategory': category
        'virtualAction': action
        'virtualLabel': label
    else
      _trace('[NoTracking] Send gtm event, category:', category, ', action:', action, ', label:', label)
    return

  self

cf.regDocReady((cf) ->
  _cfg = cf.config('gtm')
  gtmId = _cfg.gtmId
  window = cf.require('window')
  document = cf.require('document')
  _trace = cf.genTraceFn('gtm')
  _trace.startTrace()

  downloadSdkFn = ->
    _trace 'Start download google tag manager, id:', gtmId
    dataLayer = window.dataLayer = []
    i = gtmId
    dataLayer.push
      'gtm.start': (new Date).getTime()
      event: 'gtm.js'
    f = document.getElementsByTagName('script')[0]
    j = document.createElement('script')
    j.async = true
    j.src = '//www.googletagmanager.com/gtm.js?id=' + i
    f.parentNode.insertBefore j, f
    return

  downloadSdkFn() if _cfg.isDownloadGtm
  return
)