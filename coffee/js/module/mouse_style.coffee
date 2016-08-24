###
客製化滑鼠樣式
###
cf.regModule 'cfMouseStyle', ($mouse, opt = {}) ->
  ### $mouse = 會跟著滑鼠移動的物件, 請放在 $self 裡面 -> 可當作是滑鼠指標 ###
  $self = @
  cf = $self.cf
  tm = cf.require('TweenMax')
  _triggerName = 'mousemove.cfMouseStyle'
  ### $mouse 延遲移動時間 ###
  _delay = if opt.delay >= 0 then opt.delay else .3

  $mouse.css({
    position: 'absolute'
    'pointer-events': 'none'
  })

  $self.off(_triggerName).on(_triggerName, (e) ->
    pageX = e.pageX
    pageY = e.pageY
    tm.to($mouse, _delay, {
      left: pageX
      top: pageY
    })
  ).css(
    cursor: 'none'
  )

  $self