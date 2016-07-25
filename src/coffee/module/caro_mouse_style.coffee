###
客製化滑鼠樣式
$mouse = 會跟著滑鼠移動的物件, 請放在 $self 裡面 -> 可當作是滑鼠指標
###
cf.regModule 'caroMouseStyle', ($mouse, opt = {}) ->
  $self = @
  cf = $self.cf
  tm = cf.require('TweenMax')
  _triggerName = 'mousemove.caroMouseStyle'
  ### $mouse 移動時間 ###
  _duration = if opt.duration >= 0 then opt.duration else .3

  $mouse.css({
    position: 'absolute'
    'pointer-events': 'none'
  })

  $self.off(_triggerName).on(_triggerName, (e) ->
    pageX = e.pageX
    pageY = e.pageY
    selfOffset = $self.offset()
    selfX = selfOffset.left
    selfY = selfOffset.top
    tm.to($mouse, _duration, {
      left: pageX - selfX
      top: pageY - selfY
    })
  ).css(
    cursor: 'none'
  )

  $self