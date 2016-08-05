### 有搭配 .html 的 ctrl, 觸發時會讀取 menu.ctrl.html 檔並寫入 template ###
cf.regCtrl 'menu', (opt = {}) ->
  $self = @
  cf = $self.cf
  _router = cf.router
  $window = cf.$window

  setPosition = ->
    $self.css
      top: ($window.height() - $self.height()) / 2
    return

  $self.dom('.menu1', ($menu1) ->
    $menu1.onClick(->
      _router.goPage('cf')
    )
  )
  $self.dom('.menu2', ($menu2) ->
    $menu2.onClick(->
      _router.goPage('router?name=caro&age=100')
    )
  )

  setPosition()
  $window.on('resize.menu', setPosition)
  $self
, 'menu.ctrl'

cf.regDocReady (cf) ->
  $ = cf.require('$')
  $('<div>').addClass('menu').appendTo(cf.$body).menu()
  return