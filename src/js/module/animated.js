
/* Animate.css 擴充 http://daneden.github.io/animate.css */
cf.regModule('cfAnimated', function(className) {
  var $self;
  $self = this;
  $self.addClass('animated ' + className);
  return $self;
});
