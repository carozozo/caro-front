### 客製化頁面跳轉效果 ###
cf.regLib 'routeAnimate', (cf) ->
  self = {
    routeType: ''
    routeOpt: ''
  }
  tm = cf.require('TweenMax')
  tl = cf.require('TimelineMax')
  _router = cf.router

  ### 當下頁面往左邊出場, 下個頁面入場 ###
  self.left = (opt = {}) ->
    _router.transitionFn = (cf, $nowPage, $nextPage, done) ->
      _router.blockGoPage()
      duration = opt.duration or 0.8
      tm.to($nowPage, duration, {'margin-left': '-100%'}) if $nowPage
      tm.fromTo($nextPage, duration, {'margin-left': '100%'}, {
        'margin-left': 0
        onComplete: ->
          _router.approveGoPage()
          done()
      })
  ### 當下頁面往右邊出場, 下個頁面入場 ###
  self.right = (opt = {}) ->
    _router.transitionFn = (cf, $nowPage, $nextPage, done) ->
      _router.blockGoPage()
      duration = opt.duration or 0.8
      tm.to($nowPage, duration, {'margin-left': '100%'}) if $nowPage
      tm.fromTo($nextPage, duration, {'margin-left': '-100%'}, {
        'margin-left': 0
        onComplete: ->
          _router.approveGoPage()
          done()
      })
  ### 縮放入場效果 ###
  self.scale = (opt = {}) ->
    _router.transitionFn = (cf, $nowPage, $nextPage, done) ->
      _router.blockGoPage()
      duration = opt.duration or 0.4
      tl1 = new tl()
      tl1.set($nextPage, {opacity: 0})
      $nowPage.hide() if $nowPage
      tl1.fromTo($nextPage, duration, {scale: 0.1}, {
        scale: 1
        opacity: 1
        onComplete: ->
          $nextPage.css('transform', '')
          _router.approveGoPage()
          done()
      }, '-=' + duration / 2)
  ### fade 入場效果 ###
  self.fade = (opt = {}) ->
    _router.transitionFn = (cf, $nowPage, $nextPage, done) ->
      _router.blockGoPage()
      duration = opt.duration or 0.4
      tl1 = new tl()
      tm.set($nextPage, {opacity: 0})
      tl1.to($nowPage, duration, {opacity: 0}) if $nowPage
      tl1.to($nextPage, duration, {
        opacity: 1
        onComplete: ->
          _router.approveGoPage()
          done()
      })
  ### 3D Y 軸旋轉效果 ###
  self.rotateY = (opt = {}) ->
    _router.transitionFn = (cf, $nowPage, $nextPage, done) ->
      _router.blockGoPage()
      duration = opt.duration or 0.4
      perspective = opt.perspective or 1000
      tl1 = new tl()
      if($nowPage)
        $nowPage.css(
          position: 'absolute'
        )
        tl1.fromTo($nowPage, duration, {
          rotationY: 0
          transformPerspective: perspective
        }, {
          top: 30
          scale: 0.9
          rotationY: 90
        })
      originPosition = $nextPage.css('position')
      $nextPage.css(
        position: 'absolute'
      )
      tl1.fromTo($nextPage, duration, {
        top: 30
        scale: 0.9
        rotationY: 270
        transformPerspective: perspective
      }, {
        top: 0
        scale: 1
        rotationY: 360
        onComplete: ->
          _router.approveGoPage()
          $nextPage.css(
            position: originPosition
          )
          $nextPage.css('transform', '')
          done()
      })

  ### 指定預設換頁方式 ###
  self.setRouteType = (type, opt) ->
    self.routeType = type
    self.routeOpt = opt

  self

cf.regDocReady 'routeAnimate', (ti) ->
  ### 更新 router.goPage ###
  _router = ti.router
  _routeAnimate = ti.routeAnimate
  goPageFn = _router.goPage
  ### 頁面, 換頁方式, 參數 ###
  _router.goPage = (page, type = _routeAnimate.routeType, opt = _routeAnimate.routeOpt) ->
    _router.transitionFn = null if type is ''
    self[type](opt) if type
    goPageFn(page)