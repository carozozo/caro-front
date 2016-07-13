### 客製化的 tracking for GA and GTM ###
cf.regLib 'tracking', (cf) ->
  ### https://analytics.google.com/analytics/web/ ###
  ### https://tagmanager.google.com/ ###
  self = {}
  window = cf.require('window')
  _cfg = cf.config('tracking')
  _type = _cfg.type
  _trace = cf.genTraceFn('tracking')
  _trace.startTrace()
  _trackedPageName = null
  _trackedCategory = null
  _trackedLabel = null

  getGa = ->
    ga = cf.require('ga')
    unless ga
      _trace.err 'GA not load.'
      return null
    ga

  getDataLayer = ->
    dataLayer = cf.require('dataLayer')
    unless dataLayer
      _trace.err 'GTM not load.'
      return null
    dataLayer

  ### 檢查要發送的 page 之前是否才發送過 ###
  validatePage = (type, pageName) ->
    if pageName is _trackedPageName
      _trace.err 'Send duplicate', type, 'pageView:', pageName
      return false
    _trace 'Send', type, 'pageView:', pageName
    _trackedPageName = pageName
    true

  ### 檢查要發送的 event 之前是否才發送過 ###
  validateEvent = (type, category, label) ->
    if category is _trackedCategory and label is _trackedLabel
      _trace.err 'Send duplicate', type, 'event, category:', category, ', label:', label
      return false
    _trace 'Send', type, 'event, category:', category, ', label:', label
    _trackedCategory = category
    _trackedLabel = label
    true

  ### 發送 page view ###
  self.page = do ->
    switch _type
      when 1
        fn = (pageName) ->
          return unless validatePage('GA', pageName)
          ga = getGa()
          return unless ga
          ga 'send', 'pageview', pageName
          return
      when 2
        fn = (pageName) ->
          return unless validatePage('GTM', pageName)
          document = cf.require('document')
          dataLayer = getDataLayer()
          dataLayer.push
            'event': 'VirtualPageview'
            'virtualPageURL': pageName.trim()
            'virtualPageTitle': document.title
          return
      else
        fn = (pageName) -> _trace '[No tracking] PageView:', pageName
    fn

  ### 發送 event ###
  self.event = do ->
    switch _type
      when 1
        fn = (category, label) ->
          return unless validateEvent('GA', category, label)
          ga = getGa()
          return unless ga
          ga 'send', 'event', category, 'click', label
          return
      when 2
        fn = (category, label) ->
          return unless validateEvent('GTM', category, label)
          dataLayer = getDataLayer()
          dataLayer.push
            'event': 'VirtualSend'
            'virtualCategory': category.trim()
            'virtualAction': 'click'
            'virtualLabel': label.trim()
          return
      else
        fn = (category, label) -> _trace '[No tracking] Event category:', category, ', label:', label
    fn

  self

cf.regDocReady 'tracking', (cf) ->
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