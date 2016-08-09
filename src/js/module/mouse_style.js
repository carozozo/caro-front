
/*
客製化滑鼠樣式
$mouse = 會跟著滑鼠移動的物件, 請放在 $self 裡面 -> 可當作是滑鼠指標
 */
cf.regModule('cfMouseStyle', function($mouse, opt) {
  var $self, _duration, _triggerName, cf, tm;
  if (opt == null) {
    opt = {};
  }
  $self = this;
  cf = $self.cf;
  tm = cf.require('TweenMax');
  _triggerName = 'mousemove.cfMouseStyle';

  /* $mouse 移動時間 */
  _duration = opt.duration >= 0 ? opt.duration : .3;
  $mouse.css({
    position: 'absolute',
    'pointer-events': 'none'
  });
  $self.off(_triggerName).on(_triggerName, function(e) {
    var pageX, pageY, selfOffset, selfX, selfY;
    pageX = e.pageX;
    pageY = e.pageY;
    selfOffset = $self.offset();
    selfX = selfOffset.left;
    selfY = selfOffset.top;
    return tm.to($mouse, _duration, {
      left: pageX - selfX,
      top: pageY - selfY
    });
  }).css({
    cursor: 'none'
  });
  return $self;
});
