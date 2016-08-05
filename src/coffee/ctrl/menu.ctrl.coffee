### 有搭配 .html 的 ctrl, 觸發時會讀取 menu.ctrl.html 檔並寫入 template ###
cf.regCtrl 'menu', (opt = {}) ->
  $self = @
  cf = $self.cf
  _padding = '5px 10px'
  _background = '#000'
  _marginTop = 10

  cssObj =
    padding: _padding
    background: _background
    'margin-top': _marginTop

  $self.dom('.menu1', ($menu1) ->
    $menu1.css cssObj
    $menu1.onClick(->
      cf.router.goPage('index')
    )
  )
  $self.dom('.menu2', ($menu2) ->
    $menu2.css cssObj
    $menu2.onClick(->
      cf.router.goPage('view?name=caro&age=100')
    )
  )
  $self.css
#    width: '100%'
    position: 'fixed'
    top: 120
    right: 0
    background: cf.$body.css('background-color')
    'padding-bottom': 10
    'z-index': 100
, 'menu.ctrl'

cf.regDocReady (cf) ->
  $ = cf.require('$')
  $('<div>').addClass('menu').appendTo(cf.$body).menu()
  return