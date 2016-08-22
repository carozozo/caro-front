
/*
客製化滑鼠樣式
$mouse = 會跟著滑鼠移動的物件, 請放在 $self 裡面 -> 可當作是滑鼠指標
 */
cf.regModule('cfMouseStyle', function($mouse, opt) {
  var $self, _delay, _triggerName, cf, tm;
  if (opt == null) {
    opt = {};
  }
  $self = this;
  cf = $self.cf;
  tm = cf.require('TweenMax');
  _triggerName = 'mousemove.cfMouseStyle';

  /* $mouse 延遲移動時間 */
  _delay = opt.delay >= 0 ? opt.delay : .3;
  $mouse.css({
    position: 'absolute',
    'pointer-events': 'none'
  });
  $self.off(_triggerName).on(_triggerName, function(e) {
    var pageX, pageY;
    pageX = e.pageX;
    pageY = e.pageY;
    return tm.to($mouse, _delay, {
      left: pageX,
      top: pageY
    });
  }).css({
    cursor: 'none'
  });
  return $self;
});
