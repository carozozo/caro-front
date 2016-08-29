### 有搭配 .html 的 ctrl, 觸發時會讀取 template/ctrl/menu.html 檔並寫入 template ###
cf.regCtrl 'menu', ->
  $self = @
  cf = $self.cf
  tm = cf.require('TweenMax')
  bgColorArr = cf.data('bgColorArr')

  showItems = ($items) ->
    caro.forEach($items, ($item, i) ->
      tm.set($item, y: 0)
      distance = 30
      directionArr = [{x: -distance}, {x: distance}, {y: -distance}, {y: distance}]
      direction = caro.randomPick(directionArr)
      delay = i * .05
      animateObj =
        opacity: 0
      animateObj = caro.assign(animateObj, direction)
      color = caro.randomPick(bgColorArr)
      $item.css(
        background: color
      )
      tm.fromTo($item, .3, animateObj,
        opacity: 1
        x: 0
        y: 0
        ease: Back.easeOut.config(1)
        delay: delay
      )
    )
    return

  showMenu = (type) ->
    if type is 'lib'
      $libMenuItemBox.showModal(
        befShow: ->
          showItems($libMenuItems)
          return
      )
    else
      $moduleMenuItemBox.showModal(
        befShow: ->
          showItems($moduleMenuItems)
          return
      )
    return

  hideMenu = ->
    $libMenuItemBox.hideModal()
    $moduleMenuItemBox.hideModal()

  dropAllItems = (type, cb) ->
    $items = if type is 'lib' then $libMenuItems else $moduleMenuItems
    caro.forEach($items, ($item)->
      delay = Math.random() * .3
      tm.to($item, .3,
        opacity: 0
        y: cf.$window.height()
        delay: delay
      )
      return
    )
    setTimeout(cb, 500)
    return

  setMenuItem = ($item, type) ->
    $item.on('mouseover', ->
      roataionArr = [5, -5, 3, -3]
      rotation = caro.randomPick(roataionArr)
      transformOrigin = if rotation > 0 then '20% 20%' else '80% 20%'
      tm.to($item, .3,
        rotation: rotation
        transformOrigin: transformOrigin
      )
    ).on('mouseleave', ->
      tm.to($item, .3,
        rotation: 0
      )
    )
    $item.onClick(->
      dropAllItems(type, ->
        id = $item.id()
        hideMenu()
        cf.router.goPage(type + '/' + id)
      )
      return
    )
    return

  $menuBtnBox = $self.dom('#menuBtnBox')
  $libBtnOuter = $menuBtnBox.dom('#libBtnOuter')
  $moduleBtnOuter = $menuBtnBox.dom('#moduleBtnOuter')
  $libBtn = $menuBtnBox.dom('#libBtn')
  $moduleBtn = $menuBtnBox.dom('#moduleBtn')
  $libMenuItemBox = $self.dom('#libMenuItemBox').cfModal()
  $moduleMenuItemBox = $self.dom('#moduleMenuItemBox').cfModal()

  $libMenuItems = $libMenuItemBox.dom('.menuItem').coverToArr(($item) ->
    setMenuItem($item, 'lib')
  )
  $moduleMenuItems = $moduleMenuItemBox.dom('.menuItem').coverToArr(($item) ->
    setMenuItem($item, 'module')
  )

  $libBtn.on('click', ->
    showMenu('lib')
    return
  )
  $moduleBtn.on('click', ->
    showMenu()
    return
  )

  tm.staggerFrom([$libBtnOuter, $moduleBtnOuter], .5,
    right: -$libBtnOuter.width() - 20
    ease: Back.easeOut.config(1.5)
    delay: 1
  , .3)

  $self
, 'template/ctrl/menu.html'

cf.regDocReady (cf) ->
  $ = cf.require('$')
  $('#menuMain').menu()
  return