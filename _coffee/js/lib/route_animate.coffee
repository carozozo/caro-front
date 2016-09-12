###
客製化頁面跳轉效果
###
cf.regLib 'routeAnimate', (cf) ->
  self = {}
  caro = cf.require('caro')
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
          _router.$container.css(
            overflow: ''
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
          _router.$container.css(
            overflow: ''
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
      nowPageOffset = $nowPage.position()
      nowPageLeft = nowPageOffset.left
      nowPageTop = nowPageOffset.top
      halfDuration = duration / 2
      ### 每個等份的寬 ###
      eachWidth = nowPageWidth / particleX
      ### 每個等份的高 ###
      eachHeight = nowPageHeight / particleY
      ### 外部切片的容器, 繼承 $nowPage 的 css position 屬性 ###
      $pieceContainer = $('<div/>').css(
        position: $nowPage.css('position')
      ).insertAfter($nowPage)
      ### 內部切片容器, 協助切片定位 ###
      $pieceInnerContainer = $('<div/>').css(
        position: 'relative'
      ).appendTo($pieceContainer)

      count = 0
      $nextPage.hide()
      caro.loop((i) ->
        caro.loop((j) ->
          count++
          pieceLeft = eachWidth * j
          pieceTop = eachHeight * i
          $piece = $('<div/>').addClass('piece').css(
            position: 'absolute'
            width: eachWidth
            height: eachHeight
            overflow: 'hidden'
            left: pieceLeft
            top: pieceTop
          ).appendTo($pieceInnerContainer)
          $nowPage.clone().appendTo($piece).css(
            position: 'absolute'
            visibility: 'visible'
            margin: 0
            padding: 0
            width: nowPageWidth
            height: nowPageHeight
            left: -pieceLeft
            top: -pieceTop
          )
          tm.to($piece, duration,
            x: Math.floor(j - halfParticleX) * 20
            y: Math.floor(i - halfParticleY) * 20
            opacity: 0
            onComplete: ->
              return unless count is particleAll
              $nextPage.fadeIn()
              $pieceInnerContainer.remove()
              approveGo(_router, done)
              return
          )
          return
        , 0, particleX - 1)
        return
      , 0, particleY - 1)
      $nowPage.hide()
      return
    return
  ### 清除換場效果 ###
  self.clear = ->
    cf.router._transitionFn = null
    return
  self