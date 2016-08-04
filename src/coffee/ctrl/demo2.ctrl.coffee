### 一般的 ctrl ###
cf.regCtrl 'demo2Ctrl', (opt = {}) ->
  $self = @
  cf = $self.cf
  $window = cf.$window
  tm = cf.require('TweenMax')
  $self.onClick(->
    tm.to($self, .5,
      opacity: 0
      x: $window.width()
      onComplete: ->
        tm.set($self,
          opacity: 1
          x: 0
        )
        return
    )
    return
  )
  $self