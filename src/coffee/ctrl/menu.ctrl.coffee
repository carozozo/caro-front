### 有搭配 .html 的 ctrl, 觸發時會讀取 menu.ctrl.html 檔並寫入 template ###
cf.regCtrl 'menu', ->
  $self = @
  cf = $self.cf
  tm = cf.require('TweenMax')
  $window = cf.$window
  _router = cf.router
  _height = 0
  _moving = false

  $menuContent = $self.dom('#menuContent')
  contentWidth = $menuContent.width()

  setPosition = ->
    $self.css
      top: ($window.height() - _height) / 2
    return
  hideMenu = ->
    return if _moving
    _moving = true
    tm.to($self, .3
      x: contentWidth
      onComplete: ->
        $menuBtn.fadeIn()
        _moving = false
        return
    )
    return
  showMenu = ->
    return if _moving
    _moving = true
    $menuBtn.hide()
    tm.to($self, .3
      x: 0
      onComplete: ->
        _moving = false
        return
    )
    return

  $self.dom('.menuItem', ($menuItem) ->
    $menuItem.each((i, $item) ->
      $item = $($item).dom()
      itemWidth = $item.width()
      itemHeight = $item.height()
      itemMarginTop = $item.getMargin('top')
      id = $item.attr('id')
      pageName = id.replace('menu', '').toLowerCase()
      _height += itemHeight + itemMarginTop
      $item.css(
        width: itemWidth
      )
      $item.on('mouseenter', ->
        tm.to($item, .2,
          width: itemWidth * 1.5
        )
      ).on('mouseleave', ->
        tm.to($item, .2,
          width: itemWidth
        )
      ).on('click', ->
        _router.goPage(pageName)
      )
    )
  )

  $menuBtn = $self.dom('#menuBtn').on('mouseenter', showMenu)
  $self.on('mouseleave', hideMenu)
  setPosition()
  hideMenu()
  $window.on('resize.menu', setPosition)
  $self

cf.regDocReady (cf) ->
  $ = cf.require('$')
  $('#menuMain').menu()
  return