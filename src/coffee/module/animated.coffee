### Animate.css 擴充 http://daneden.github.io/animate.css ###
cf.regModule 'cfAnimated', (className) ->
  $self = @
  $self.addClass('animated ' + className)
  $self