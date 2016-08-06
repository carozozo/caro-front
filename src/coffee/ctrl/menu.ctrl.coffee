### 有搭配 .html 的 ctrl, 觸發時會讀取 menu.ctrl.html 檔並寫入 template ###
cf.regCtrl 'menu', ->
  $self = @
  cf = $self.cf
  tm = cf.require('TweenMax')
  $window = cf.$window
  _router = cf.router
  _height = 0

  setPosition = ->
    $self.css
      top: ($window.height() - _height) / 2
    return

  $self.dom('.menuItem', ($menuItem) ->
    $menuItem.each((i, $item) ->
      $item = $($item)
      itemWidth = $item.width()
      itemHeight = $item.height()
      backgroundColor = $item.css('background-color')
      height = i * (itemHeight + 20)
      _height += height
      $item.css(
        top: i * (itemHeight + 20)
      )
      $item.on('mouseenter', ->
        tm.to($item, .2,
          width: itemWidth * 1.5
          'background-color': '#eeeeee'
        )
      ).on('mouseleave', ->
        tm.to($item, .2,
          width: itemWidth
          'background-color': backgroundColor
        )
      )
    )
  )

  $self.dom('.menuCf', ($menu) ->
    $menu.onClick(->
      _router.goPage('cf')
    )
  )
  $self.dom('.menuAjax', ($menu) ->
    $menu.onClick(->
      _router.goPage('ajax')
    )
  )
  $self.dom('.menuRouter', ($menu) ->
    $menu.onClick(->
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