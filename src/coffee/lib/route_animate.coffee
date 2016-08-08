### 客製化頁面跳轉效果 ###
cf.regLib 'routeAnimate', (cf) ->
  self = {}
  tl = cf.require('TimelineMax')

  ### 左移換場效果 ###
  self.left = (opt = {}) ->
    _router = cf.router
    _router.transitionFn = (cf, $nowPage, $nextPage, nowPageDone, done) ->
      _router.blockGoPage()
      duration = opt.duration or .8
      duration = duration / 2
      tl1 = new tl()
      tl1.to($nowPage, duration,
        position: 'absolute'
        'margin-left': '-100%'
        ease: Power0.easeNone
        onComplete: ->
          nowPageDone()
          return
      ).fromTo($nextPage, duration, {'margin-left': '100%'},
        'margin-left': 0
        delay: .1
        ease: Power0.easeNone
        onComplete: ->
          _router.approveGoPage()
          done()
          return
      )
      return
  ### 右移換場效果 ###
  self.right = (opt = {}) ->
    _router = cf.router
    _router.transitionFn = (cf, $nowPage, $nextPage, nowPageDone, done) ->
      _router.blockGoPage()
      duration = opt.duration or .8
      duration = duration / 2
      tl1 = new tl()
      tl1.to($nowPage, duration,
        position: 'absolute'
        'margin-left': '100%'
        ease: Power0.easeNone
        onComplete: ->
          nowPageDone()
          return
      ).fromTo($nextPage, duration, {'margin-left': '-100%'},
        'margin-left': 0
        ease: Power0.easeNone
        onComplete: ->
          _router.approveGoPage()
          done()
          return
      )
      return
  ### 縮放換場效果 ###
  self.scale = (opt = {}) ->
    _router = cf.router
    _router.transitionFn = (cf, $nowPage, $nextPage, nowPageDone, done) ->
      _router.blockGoPage()
      duration = opt.duration or .8
      duration = duration / 2
      tl1 = new tl()
      tl1.to($nowPage, duration,
        scale: 0
        opacity: 0
        ease: Power0.easeNone
        onComplete: ->
          nowPageDone()
          return
      ).fromTo($nextPage, duration,
        scale: 0
        opacity: 0
      ,
        scale: 1
        opacity: 1
        ease: Power0.easeNone
        onComplete: ->
          $nextPage.css('transform', '')
          _router.approveGoPage()
          done()
      , '-=' + duration / 2)
      return
  ### fade 換場效果 ###
  self.fade = (opt = {}) ->
    _router = cf.router
    _router.transitionFn = (cf, $nowPage, $nextPage, nowPageDone, done) ->
      _router.blockGoPage()
      duration = opt.duration or .8
      duration = duration / 2
      tl1 = new tl()
      tl1.to($nowPage, duration, {
        opacity: 0
        onComplete: ->
          nowPageDone()
          return
      }).fromTo($nextPage, duration, {opacity: 0}, {
        opacity: 1
        onComplete: ->
          _router.approveGoPage()
          done()
          return
      })
      return
  ### 清除換場效果 ###
  self.clear = ->
    cf.router.transitionFn = null
    return
  self