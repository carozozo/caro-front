###
客製化頁面跳轉效果
###
cf.regLib 'routeAnimate', (cf) ->
  self = {}
  tm = cf.require('TweenMax')
  tl = cf.require('TimelineMax')

  approveGo = (router, done) ->
    router.approveGoPage()
    done()
    return

  ### 左移換場效果 ###
  self.left = (opt = {}) ->
    _router = cf.router
    _router._transitionFn = (cf, $nowPage, $nextPage, done) ->
      _router.blockGoPage()
      ### 換頁時間 ###
      duration = opt.duration or .8

      _router.$container.css(
        overflow: 'hidden'
      )
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
            transform: ''
          )
          approveGo(_router, done)
          return
      })
      return
    return
  ### 右移換場效果 ###
  self.right = (opt = {}) ->
    _router = cf.router
    _router._transitionFn = (cf, $nowPage, $nextPage, done) ->
      _router.blockGoPage()
      ### 換頁時間 ###
      duration = opt.duration or .8

      _router.$container.css(
        overflow: 'hidden'
      )
      duration = duration / 2
      position = $nextPage.css('position')
      tm.to($nowPage, duration,
        position: 'fixed'
        'margin-left': '100%'
        ease: Power0.easeNone
      )
      tm.fromTo($nextPage, duration, {
        position: 'fixed'
        'margin-left': '-100%'
      }, {
        'margin-left': 0
        ease: Power0.easeNone
        onComplete: ->
          $nextPage.css(
            position: position
            transform: ''
          )
          approveGo(_router, done)
          return
      })
      return
    return
  ### 縮放換場效果 ###
  self.scale = (opt = {}) ->
    _router = cf.router
    _router._transitionFn = (cf, $nowPage, $nextPage, done) ->
      _router.blockGoPage()
      ### 換頁時間 ###
      duration = opt.duration or .8
      ### 旋轉角度 ###
      rotation = opt.rotation or 0

      duration = duration / 2
      $nextPage.hide()
      tl1 = new tl()
      tl1.to($nowPage, duration,
        scale: 0
        opacity: 0
        rotation: rotation
        ease: Power0.easeNone
        onComplete: ->
          $nowPage.hide()
          $nextPage.show()
          return
      )
      .fromTo($nextPage, duration,
        scale: 0
        opacity: 0
        rotation: rotation
      ,
        scale: 1
        opacity: 1
        rotation: 0
        ease: Power0.easeNone
        onComplete: ->
          $nextPage.css(
            transform: ''
          )
          approveGo(_router, done)
          return
      )
      return
    return
  ### fade 換場效果 ###
  self.fade = (opt = {}) ->
    _router = cf.router
    _router._transitionFn = (cf, $nowPage, $nextPage, done) ->
      _router.blockGoPage()
      ### 換頁時間 ###
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
          approveGo(_router, done)
          return
      })
      return
    return
  ### slide 換場效果 ###
  self.slide = (opt = {}) ->
    _router = cf.router
    _router._transitionFn = (cf, $nowPage, $nextPage, done) ->
      _router.blockGoPage()
      ### 換頁時間 ###
      duration = opt.duration or .8

      duration = duration / 2 * 1000
      $nextPage.hide()
      $nowPage.slideUp(duration, ->
        $nowPage.hide()
        $nextPage.slideDown(duration, ->
          approveGo(_router, done)
          return
        )
        return
      )
      return
    return

  self.piece = (opt = {}) ->
    _router = cf.router
    _router._transitionFn = (cf, $nowPage, $nextPage, done) ->
      _router.blockGoPage()
      ### 換頁時間 ###
      duration = opt.duration or .8
      ### x 要切成幾等份 ###
      particleX = opt.particleX or 3
      ### y 要切成幾等份 ###
      particleY = opt.particleY or 3

      halfParticleX = particleX / 2
      halfParticleY = particleY / 2
      ### 全部切成幾等份 ###
      particleAll = particleX * particleY
      nowPagePosition = $nowPage.css('position')
      nowPageWidth = $nowPage.width()
      nowPageHeight = $nowPage.height()
      nowPageOffset = $nowPage.offset()
      nowPageLeft = nowPageOffset.left
      nowPageTop = nowPageOffset.top
      halfDuration = duration / 2
      ### 每個等份的寬 ###
      eachWidth = nowPageWidth / particleX
      ### 每個等份的高 ###
      eachHeight = nowPageHeight / particleY
      piecePosition = if nowPagePosition is 'fixed' then 'fixed' else 'absolute'
      count = 0
      $nextPage.hide()
      caro.loop((j)->
        caro.loop((i)->
          count++
          left = nowPageLeft + (eachWidth * (i - 1))
          top = nowPageTop + (eachHeight * (j - 1))
          $dom = $('<div/>').css(
            position: piecePosition
            width: eachWidth
            height: eachHeight
            overflow: 'hidden'
            left: left
            top: top
          )
          $nowPage.after($dom)

          $nowPage.clone().css(
            position: 'absolute'
            visibility: 'visible'
            width: nowPageWidth
            height: nowPageHeight
            left: -(eachWidth * (i - 1))
            top: -(eachHeight * (j - 1))
          ).appendTo($dom)

          animateObj =
            onComplete: ->
              if count is particleAll
                $nextPage.fadeIn()
                approveGo(_router, done)
              $dom.remove()
              return
          ### 計算位移量 ###
          animateObj.x = Math.floor(i - halfParticleX) * 20
          animateObj.y = Math.floor(j - halfParticleY) * 20
          tm.to($dom, duration, animateObj)
          tm.to($dom, halfDuration,
            opacity: 0
            delay: halfDuration
          , animateObj)
          return
        , 1, particleX)
        return
      , 1, particleY)
      $nowPage.hide()
      return
    return
  ### 清除換場效果 ###
  self.clear = ->
    cf.router._transitionFn = null
    return
  self