### 有搭配 .html 的 ctrl, 觸發時會讀取 template/menu.ctrl.html 檔並寫入 template ###
cf.regCtrl 'menu', ->
  $self = @
  cf = $self.cf
  $window = cf.$window
  tm = cf.require('TweenMax')

  bindWindow = ->
    $window.on('click.menu', hideMenu)
    return
  unbindWindow = ->
    $window.off('click.menu')
    return

  $menuBtnBox = $self.dom('#menuBtnBox')
  $libBtn = $menuBtnBox.dom('#libBtn')
  $moduleBtn = $menuBtnBox.dom('#moduleBtn')
  $menuContent = $self.dom('.menuContent')
  $menuLibContent = $self.dom('#menuLibContent')
  $menuModuleContent = $self.dom('#menuModuleContent')

  $menuLibContent.$$originalWidth = $menuLibContent.width()
  $menuModuleContent.$$originalWidth = $menuModuleContent.width()
  $menuLibContent.hide()
  $menuModuleContent.hide()

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
    $menuBtnBox.hide()
    $content = if type is 'lib' then $menuLibContent else $menuModuleContent
    $content.show()
    tm.fromTo($content, .5, {
      x: $menuLibContent.$$originalWidth
    }, {
      x: 0
      onComplete: bindWindow
    })
    return

  hideMenu = ->
    $menuBtnBox.fadeIn()
    $menuContent.hide()
    unbindWindow()
    return

  $libBtn.on('click', ->
    showMenu('lib')
  )
  $moduleBtn.on('click', ->
    showMenu()
  )
  $menuContent.on('click', ->
    hideMenu()
  )
  $self
, 'template/menu.ctrl.html'

cf.regDocReady (cf) ->
  $ = cf.require('$')
  $('#menuMain').menu()
  return