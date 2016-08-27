
/*
客製化滑鼠樣式
 */
cf.regModule('cfMouseStyle', function($mouse, opt) {
  var $self, _delay, _triggerName, cf, checkIfRelative, tm;
  if (opt == null) {
    opt = {};
  }

  /* $mouse = 會跟著滑鼠移動的物件, 請放在 $self 裡面 -> 可當作是滑鼠指標 */
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
  checkIfRelative = function() {
    var gotRelative;
    gotRelative = false;
    $self.parents().each(function(i, ele) {
      var $dom, position;
      $dom = $(ele);
      position = $dom.css('position');
      if (position === 'relative') {
        return gotRelative = $dom;
      }
    });
    return gotRelative;
  };
  $self.off(_triggerName).on(_triggerName, function(e) {
    var $domWithRelative, left, offset, top;
    $domWithRelative = checkIfRelative();
    left = e.pageX;
    top = e.pageY;
    if ($domWithRelative) {
      offset = $domWithRelative.offset();
      left = left - offset.left;
      top = top - offset.top;
    }
    return tm.to($mouse, _delay, {
      left: left,
      top: top
    });
  }).css({
    cursor: 'none'
  });
  return $self;
});
