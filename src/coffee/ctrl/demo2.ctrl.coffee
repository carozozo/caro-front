### 一般的 ctrl ###
cf.regCtrl 'demo2Ctrl', (opt = {}) ->
  $self = @
  cf = $self.cf
  tm = cf.require('TweenMax')
  $self.onClick(->
    tm.to($self, .5,
      x: 2000
      onComplete: ->
        tm.set($self,
          x: 0
        )
        return
    )
    return
  )
  $self