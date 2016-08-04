### 有搭配 .html 的 ctrl ###
cf.regCtrl 'demoCtrl', (opt = {}) ->
  $self = @
  cf = $self.cf
  _padding = '5px 10px'
  _display = 'inline-block'
  _background = '#000'
  _marginLeft = 10

  cssObj =
    padding: _padding
    position: _display
    background: _background
    display: _display
    'margin-left': _marginLeft

  $self.dom('.menu1', ($menu1) ->
    $menu1.css cssObj
    $menu1.onClick(->
      cf.router.goPage('index')
    )
  )
  $self.dom('.menu2', ($menu2) ->
    $menu2.css cssObj
    $menu2.onClick(->
      cf.router.goPage('view')
    )
  )
  $self.css width: '100%'
, 'demo.ctrl'

cf.regDocReady (cf) ->
  $ = cf.require('$')
  $('<div>').addClass('menu').appendTo(cf.$body).demoCtrl()
  return