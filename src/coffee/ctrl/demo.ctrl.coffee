### 一般 ctrl ###
cf.regCtrl 'demoCtrl', ((opt = {}) ->
  $self = @
  cf = $self.cf
  $self
)

### 有搭配 .html 的 ctrl ###
cf.regCtrl 'demo2Ctrl', ((opt = {}) ->
  $self = @
  cf = $self.cf
  $self
), 'demo.ctrl'