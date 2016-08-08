### 客製化頁面跳轉效果 ###
cf.regLib 'routeAnimate', (cf) ->
  self = {}
  tm = cf.require('TweenMax')
  tl = cf.require('TimelineMax')

  ### 當下頁面往左邊出場, 下個頁面入場 ###
  self.left = (opt = {}) ->
    _router = cf.router
    _router.transitionFn = (cf, $nowPage, $nextPage, nowPageDone, done) ->
      _router.blockGoPage()
      duration = opt.duration or 0.4
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
  ### 當下頁面往右邊出場, 下個頁面入場 ###
  self.right = (opt = {}) ->
    _router = cf.router
    _router.transitionFn = (cf, $nowPage, $nextPage, nowPageDone, done) ->
      _router.blockGoPage()
      duration = opt.duration or .4
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
  ### 縮放入場效果 ###
  self.scale = (opt = {}) ->
    _router = cf.router
    _router.transitionFn = (cf, $nowPage, $nextPage, nowPageDone, done) ->
      _router.blockGoPage()
      duration = opt.duration or 0.4
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
  ### fade 入場效果 ###
  self.fade = (opt = {}) ->
    _router = cf.router
    _router.transitionFn = (cf, $nowPage, $nextPage, nowPageDone, done) ->
      _router.blockGoPage()
      duration = opt.duration or 0.4
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
  self