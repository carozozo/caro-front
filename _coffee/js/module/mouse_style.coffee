###
客製化滑鼠樣式
Depend on gsap
###
cf.regModule 'cfMouseStyle', ($mouse, opt = {}) ->
  ### $mouse = 會跟著滑鼠移動的物件, 請放在 $self 裡面 -> 可當作是滑鼠指標 ###
  $self = @
  tm = cf.require('TweenMax')
  _triggerName = 'mousemove.cfMouseStyle'
  ### $mouse 延遲移動時間 ###
  _delay = if opt.delay >= 0 then opt.delay else .3

  $mouse.css({
    position: 'absolute'
    'pointer-events': 'none'
  })

  $self.on(_triggerName, (e) ->
    $offsetParent = $self.offsetParent()
    left = e.pageX
    top = e.pageY
    if $offsetParent.length
      offset = $offsetParent.offset()
      left = left- offset.left
      top = top- offset.top
    tm.to($mouse, _delay, {
      left: left
      top: top
    })
  ).css(
    cursor: 'none'
  )

  $self