### 客製化的 tracking for GA and GTM ###
cf.regLib 'tracking', (cf) ->
  ### https://analytics.google.com/analytics/web/ ###
  ### https://tagmanager.google.com/ ###
  self = {}
  window = cf.require('window')
  _cfg = cf.config('tracking')
  _type = _cfg.type
  _defCategory = _cfg.defCategory
  _prefix = _cfg.prefix
  _trace = cf.genTraceFn('tracking')
  _trace.startTrace()
  _trackedPageName = null
  _trackedCategory = null
  _trackedAction = null
  _trackedLabel = null

  getGa = ->
    ga = cf.require('ga')
    _trace.err 'GA not load.' unless ga
    ga

  getDataLayer = ->
    dataLayer = cf.require('dataLayer')
    _trace.err 'GTM not load.' unless dataLayer
    dataLayer

  ### 檢查要發送的 page 之前是否才發送過 ###
  validatePage = (type, pageName) ->
    if pageName is _trackedPageName
      _trace 'Send duplicate', type, 'pageView:', pageName
      return false
    _trace 'Send', type, 'pageView:', pageName
    _trackedPageName = pageName
    true

  ### 檢查要發送的 event 之前是否才發送過 ###
  validateEvent = (type, category, action, label) ->
    if category is _trackedCategory and action is _trackedAction and label is _trackedLabel
      _trace 'Send duplicate', type, 'event, category:', category, ', action:', action, ', label:', label
      return false
    _trace 'Send', type, 'event, category:', category, ', action:', action, ', label:', label
    _trackedCategory = category
    _trackedAction = action
    _trackedLabel = label
    true

  ### 發送 page view ###
  self.page = do ->
    switch _type
      when 1
        fn = (pageName) ->
          pageName = _prefix + '_' + pageName.trim() if _prefix
          return unless validatePage('GA', pageName)
          ga = getGa()
          ga 'send', 'pageview', pageName
          return
      when 2
        fn = (pageName) ->
          pageName = _prefix + '_' + pageName.trim() if _prefix
          return unless validatePage('GTM', pageName)
          document = cf.require('document')
          dataLayer = getDataLayer()
          dataLayer.push
            'event': 'VirtualPageview'
            'virtualPageURL': pageName
            'virtualPageTitle': document.title
          return
      else
        fn = (pageName) -> _trace '[No tracking] PageView:', pageName
    fn

  ### 發送 event ###
  self.event = do ->
    switch _type
      when 1
        fn = (action, label, category = _defCategory) ->
          if _prefix
            action = _prefix + '_' + action.trim()
            label = _prefix + '_' + label.trim()
          return unless validateEvent('GA', action, label)
          ga = getGa()
          ga 'send', 'event', category.trim(), action, label
          return
      when 2
        fn = (action, label, category = _defCategory) ->
          if _prefix
            action = _prefix + '_' + action.trim()
            label = _prefix + '_' + label.trim()
          return unless validateEvent('GTM', action, label)
          dataLayer = getDataLayer()
          dataLayer.push
            'event': 'VirtualSend'
            'virtualCategory': category.trim()
            'virtualAction': action
            'virtualLabel': label
          return
      else
        fn = (category, label) -> _trace '[No tracking] Event category:', category, ', label:', label
    fn

  self

cf.regDocReady((cf) ->
  $ = cf.require('$')
  _cfg = cf.config('tracking')
  _type = _cfg.type
  _tagId = _cfg.tagId
  window = cf.require('window')
  document = cf.require('document')
  _trace = cf.genTraceFn('tracking')
  _trace.startTrace()

  _sdkFnMap =
    1: ->
      _trace 'Start download google analytics, _tagId:', _tagId
      ((i, s, o, g, r, a, m) ->
        i['GoogleAnalyticsObject'] = r
        i[r] = i[r] or ->
            (i[r].q = i[r].q or []).push arguments
            return
        i[r].l = 1 * new Date
        a = s.createElement(o)
        m = s.getElementsByTagName(o)[0]
        a.async = 1
        a.src = g
        m.parentNode.insertBefore a, m
        return)(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga')
      ga('create', _tagId, 'auto')
      return
    2: ->
      _trace 'Start download google tag manager, _tagId:', _tagId
      dataLayer = window.dataLayer = []
      i = _tagId
      dataLayer.push
        'gtm.start': (new Date).getTime()
        event: 'gtm.js'
      f = document.getElementsByTagName('script')[0]
      j = document.createElement('script')
      j.async = true
      j.src = '//www.googletagmanager.com/gtm.js?id=' + i
      f.parentNode.insertBefore j, f
      return
  downloadSdkFn = _sdkFnMap[_type]
  downloadSdkFn and downloadSdkFn()
  return
)