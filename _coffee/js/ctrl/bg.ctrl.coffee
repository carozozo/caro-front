cf.regCtrl 'bg', ->
  $self = @
  tm = cf.require('TweenMax')

  $bgContainer = $('<div/>').attr('id', 'bgContainer').appendTo($self)
  caro.loop((i) ->
    caro.loop((j) ->
      $('<div/>').addClass('bgBlock').css(
        top: i * 30
        left: j * 30
      ).appendTo($bgContainer)
      return
    , 1, 70)
    return
  , 1, 35)
  tm.set($bgContainer,
    transformPerspective: 500
    rotationX: 85
  )

  cf.router.regPrePage(->
    tm.to('#bgContainer', 1,
      x: cf.randomInt(0, -500)
      rotationX: cf.randomInt(89, 70)
    )
  )

  cf.router.regAftPage(->
    $window = cf.$window
    $window.on('scroll', ->
      scrollTop = $window.scrollTop()
      left = scrollTop / 10
      top = scrollTop / 100
      tm.to($bgContainer, .5,
        x: -left
        y: -top
      )
      return
    )
    return
  )

  $self

cf.regDocReady (cf) ->
  $ = cf.require('$')
  $('#bg').bg()
  return