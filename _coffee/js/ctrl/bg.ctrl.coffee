cf.regCtrl 'bg', ->
  $self = @
  tm = cf.require('TweenMax')

  $bgFloor = $('<div/>').attr('id', 'bgFloor').appendTo($self)
  blockWidth = 30
  blockHeight = 30
  blockAmount = 50
  bgFloorWidth = blockWidth * blockAmount
  bgFloorHeight = blockHeight * blockAmount
  cf.loop((i) ->
    cf.loop((j) ->
      $('<div/>').addClass(if (i + j) % 2 is 0 then 'bgBlock1' else 'bgBlock2').css(
        top: i * blockHeight
        left: j * blockWidth
      ).appendTo($bgFloor)
      return
    , 1, blockAmount)
    return
  , 1, blockAmount)
  tm.set($bgFloor,
    transformPerspective: 1500
    rotationX: 80
  )
  tm.from($bgFloor, 3
    opacity: 0
    rotationX: 0
  )

  cf.router.regPrePage(->
    bindMouse = ->
      $window = cf.$window
      $window.on('mousemove', (e) ->
        mouseX = e.pageX - $window.scrollLeft()
        mouseY = e.pageY - $window.scrollTop()
        distX = mouseX / 100
        distY = mouseY / 100
        tm.to($bgFloor, 0,
          x: randX - distX
          y: randY - distY
        )
      )
      return

    randX = bgFloorWidth / 2
    randX = cf.randomInt(0, -randX)
    randY = bgFloorHeight / 8
    randY = cf.randomInt(randY)
    tm.to($bgFloor, 1,
      x: randX
      y: randY
      onComplete: bindMouse
    )
    return
  )

  $self

cf.regDocReady (cf) ->
  $ = cf.require('$')
  $('#bg').bg()
  return