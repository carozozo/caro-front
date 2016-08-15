### 客製化頁面跳轉效果 ###
cf.regLib 'routeAnimate', (cf) ->
  self = {}
  tm = cf.require('TweenMax')
  tl = cf.require('TimelineMax')

  ### 左移換場效果 ###
  self.left = (opt = {}) ->
    _router = cf.router
    _router._transitionFn = (cf, $nowPage, $nextPage, done) ->
      _router.$container.css(
        overflow: 'hidden'
      )
      duration = opt.duration or .8
      duration = duration / 2
      position = $nextPage.css('position')
      tm.to($nowPage, duration,
        position: 'fixed'
        'margin-left': '-100%'
        ease: Power0.easeNone
      )
      tm.fromTo($nextPage, duration, {
        position: 'fixed'
        'margin-left': '100%'
      }, {
        'margin-left': 0
        delay: .1
        ease: Power0.easeNone
        onComplete: ->
          $nextPage.css(
            position: position
          )
          done()
          return
      })
      return
  ### 右移換場效果 ###
  self.right = (opt = {}) ->
    _router = cf.router
    _router._transitionFn = (cf, $nowPage, $nextPage, done) ->
      _router.$container.css(
        overflow: 'hidden'
      )
      duration = opt.duration or .8
      duration = duration / 2
      position = $nextPage.css('position')
      tm.to($nowPage, duration,
        position: 'fixed'
        'margin-left': '-100%'
        ease: Power0.easeNone
      )
      tm.fromTo($nextPage, duration, {
        position: 'fixed'
        'margin-left': '100%'
      }, {
        'margin-left': 0
        ease: Power0.easeNone
        onComplete: ->
          $nextPage.css(
            position: position
          )
          done()
          return
      })
      return
  ### 縮放換場效果 ###
  self.scale = (opt = {}) ->
    _router = cf.router
    _router._transitionFn = (cf, $nowPage, $nextPage, done) ->
      duration = opt.duration or .8
      duration = duration / 2
      $nextPage.hide()
      tl1 = new tl()
      tl1.to($nowPage, duration,
        scale: 0
        opacity: 0
        ease: Power0.easeNone
        onComplete: ->
          $nowPage.hide()
          $nextPage.show()
          return
      )
      .fromTo($nextPage, duration,
        scale: 0
        opacity: 0
      ,
        scale: 1
        opacity: 1
        ease: Power0.easeNone
        onComplete: ->
          done()
          return
      )
      return
  ### fade 換場效果 ###
  self.fade = (opt = {}) ->
    _router = cf.router
    _router._transitionFn = (cf, $nowPage, $nextPage, done) ->
      duration = opt.duration or .8
      duration = duration / 2
      $nextPage.hide()
      tl1 = new tl()
      tl1.to($nowPage, duration, {
        opacity: 0
        onComplete: ->
          $nowPage.hide()
          $nextPage.show()
          return
      }).fromTo($nextPage, duration, {opacity: 0}, {
        opacity: 1
        onComplete: ->
          done()
          return
      })
      return
  ### 清除換場效果 ###
  self.clear = ->
    cf.router._transitionFn = null
    return
  self