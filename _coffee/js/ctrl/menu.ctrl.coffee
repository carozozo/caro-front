### 有搭配 .html 的 ctrl, 觸發時會讀取 template/menu.ctrl.html 檔並寫入 template ###
cf.regCtrl 'menu', ->
  $self = @
  cf = $self.cf
  tm = cf.require('TweenMax')
  bgColorArr = cf.data('bgColorArr')
  showItems = ($items) ->
    caro.forEach($items, ($item, i) ->
      distance = 30
      directionArr = [{x: -distance}, {x: distance}, {y: -distance}, {y: distance}]
      direction = caro.randomPick(directionArr)
      delay = i * .05
      animateObj =
        opacity: 0
        ease: Back.easeOut.config(1)
        delay: delay
      animateObj = caro.assign(animateObj, direction)
      color = caro.randomPick(bgColorArr)
      $item.css(
        background: color
      )
      tm.from($item, .3, animateObj)
    )
    return

  $menuBtnBox = $self.dom('#menuBtnBox')
  $libBtn = $menuBtnBox.dom('#libBtn')
  $moduleBtn = $menuBtnBox.dom('#moduleBtn')
  $libMenuItemBox = $self.dom('#libMenuItemBox').cfModal(
    befShow: ->
      showItems($libMenuItem)
      return
  )
  $moduleMenuItemBox = $self.dom('#moduleMenuItemBox').cfModal(
    befShow: ->
      showItems($moduleMenuItem)
      return
  )

  $libMenuItem = $libMenuItemBox.dom('.menuItem').mapDom(($item) ->
    $item.onClick(->
      id = $item.id()
      cf.router.goPage('lib/' + id)
      $libMenuItemBox.hideModal()
      return
    )
  )
  $moduleMenuItem = $moduleMenuItemBox.dom('.menuItem').mapDom(($item) ->
    $item.onClick(->
      id = $item.id()
      cf.router.goPage('module/' + id)
      $moduleMenuItemBox.hideModal()
      return
    )
  )
  showMenu = (type) ->
    if type is 'lib'
      $libMenuItemBox.showModal()
    else
      $moduleMenuItemBox.showModal()
    return

  $libBtn.on('click', ->
    showMenu('lib')
    return
  )
  $moduleBtn.on('click', ->
    showMenu()
    return
  )
  $self
, 'template/menu.ctrl.html'

cf.regDocReady (cf) ->
  $ = cf.require('$')
  $('#menuMain').menu()
  return