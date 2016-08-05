
/* Animate.css 擴充 http://daneden.github.io/animate.css */
cf.regModule('caroAnimated', function(className) {
  var $self;
  $self = this;
  $self.addClass('animated ' + className);
  return $self;
});
