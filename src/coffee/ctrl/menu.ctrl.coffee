### 有搭配 .html 的 ctrl, 觸發時會讀取 menu.ctrl.html 檔並寫入 template ###
cf.regCtrl 'menu', ->
  $self = @
  cf = $self.cf
  tm = cf.require('TweenMax')

  ### menu 列表最大高度 ###
  _menuItemBoxHeight = 350
  ### 每次捲動高度 ###
  _menuScrollStep = _menuItemBoxHeight
  $menuBtn = $self.dom('.menuBtn')
  $libBtn = $self.dom('#libBtn')
  $moduleBtn = $self.dom('#moduleBtn')
  $menuContent = $self.dom('.menuContent')
  $menuItemBox = $self.dom('.menuItemBox')

  $menuLibItemBox = $self.dom('#menuLibItemBox')
  $menuLibItemInnerBox = $menuLibItemBox.find('.innerBox')
  $menuLibItemInnerBox.$$top = 0
  $menuLibContent = $self.dom('#menuLibContent')
  $upLibBtn = $self.dom('#upLibBtn')
  $downLibBtn = $self.dom('#downLibBtn')
  $menuLibItemBox.$$height = $menuLibItemBox.height()
  _minLibTop = _menuItemBoxHeight - $menuLibItemBox.$$height - 5

  $menuModuleItemBox = $self.dom('#menuModuleItemBox')
  $menuModuleItemInnerBox = $menuModuleItemBox.find('.innerBox')
  $menuModuleItemInnerBox.$$top = 0
  $menuModuleContent = $self.dom('#menuModuleContent')
  $upModuleBtn = $self.dom('#upModuleBtn')
  $downModuleBtn = $self.dom('#downModuleBtn')
  $menuModuleItemBox.$$height = $menuModuleItemBox.height()
  _minModuleTop = _menuItemBoxHeight - $menuModuleItemBox.$$height - 5

  if _minLibTop > -1
    $upLibBtn.hide()
    $downLibBtn.hide()
  if _minModuleTop > -1
    $upModuleBtn.hide()
    $downModuleBtn.hide()

  $menuItemBox.css(
    'max-height': _menuItemBoxHeight
    overflow: 'hidden'
  )
  $menuLibContent.hide()
  $menuModuleContent.hide()
  $menuLibContent.$$width = $menuLibContent.width()
  $menuModuleContent.$$width = $menuModuleContent.width()

  $menuLibContent.dom('.menuItem').eachDom(($item) ->
    $item.onClick(->
      id = $item.id()
      cf.router.goPage('lib/' + id)
      return
    )
  )
  $menuModuleContent.dom('.menuItem').eachDom(($item) ->
    $item.onClick(->
      id = $item.id()
      cf.router.goPage('module/' + id)
      return
    )
  )

  showMenu = (type) ->
    $menuBtn.hide()
    $content = if type is 'lib' then $menuLibContent else $menuModuleContent
    $content.show()
    tm.from($content, .5,
      x: $menuLibContent.$$width
    )
    return

  hideMenu = ->
    $menuBtn.fadeIn()
    $menuContent.hide()
    return

  $libBtn.on('mouseenter', ->
    showMenu('lib')
  )
  $moduleBtn.on('mouseenter', ->
    showMenu()
  )
  $menuContent.on('mouseleave', ->
    hideMenu()
  )

  $upLibBtn.on('click', ->
    newTop = $menuLibItemInnerBox.$$top + _menuScrollStep
    newTop = 0 if newTop > 0
    $menuLibItemInnerBox.$$top = newTop
    tm.to($menuModuleItemInnerBox, 1,
      y: newTop
    )
  )
  $downLibBtn.on('click', ->
    newTop = $menuLibItemInnerBox.$$top - _menuScrollStep
    newTop = _minLibTop if newTop < _minLibTop
    $menuLibItemInnerBox.$$top = newTop
    tm.to($menuLibItemInnerBox, 1,
      y: newTop
    )
  )
  $upModuleBtn.on('click', ->
    newTop = $menuModuleItemInnerBox.$$top + _menuScrollStep
    newTop = 0 if newTop > 0
    $menuModuleItemInnerBox.$$top = newTop
    tm.to($menuModuleItemInnerBox, 1,
      y: newTop
    )
  )
  $downModuleBtn.on('click', ->
    newTop = $menuModuleItemInnerBox.$$top - _menuScrollStep
    newTop = _minModuleTop if newTop < _minModuleTop
    $menuModuleItemInnerBox.$$top = newTop
    tm.to($menuModuleItemInnerBox, 1,
      y: newTop
    )
  )

  $self
, 'template/menu.ctrl.html'

cf.regDocReady (cf) ->
  $ = cf.require('$')
  $('#menuMain').menu()
  return