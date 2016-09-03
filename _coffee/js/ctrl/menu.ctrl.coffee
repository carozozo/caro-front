### 有搭配 .html 的 ctrl, 觸發時會讀取 template/ctrl/menu.html 檔並寫入 template ###
cf.regCtrl 'menu', ->
  $self = @
  $window = cf.$window
  tm = cf.require('TweenMax')
  bgColorArr = cf.data('bgColorArr')

  showItems = ($items) ->
    cf.forEach($items, ($item, i) ->
      tm.set($item, y: 0)
      distance = 30
      directionArr = [{x: -distance}, {x: distance}, {y: -distance}, {y: distance}]
      direction = cf.randomPick(directionArr)
      delay = i * .05
      animateObj =
        opacity: 0
      for key, val of direction
        animateObj[key] = val
      color = cf.randomPick(bgColorArr)
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
    cf.forEach($items, ($item)->
      delay = Math.random() * .3
      tm.to($item, .3,
        opacity: 0
        y: 500
        delay: delay
      )
      return
    )
    setTimeout(cb, 500)
    return

  setMenuItem = ($item, type) ->
    $item.on('mouseover', ->
      roataionArr = [5, -5, 3, -3]
      rotation = cf.randomPick(roataionArr)
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
        hideMenu()
      )
      id = $item.id()
      cf.router.goPage(type + '/' + id)
      return
    )
    return

  setMenuBtn = ($btn) ->
    tm.set($btn,
      transformPerspective: 600
      transformOriginal: '100% 50%'
    )
    $btn.on('mouseover', ->
      tm.to($btn, .2,
        rotationY: -30
        x: -10
      )
    ).on('mouseleave', ->
      tm.to($btn, .1,
        rotationY: 0
        x: 0
      )
    )
    return

  $menuBtnBox = $self.dom('#menuBtnBox')
  $libBtnOuter = $menuBtnBox.dom('#libBtnOuter', ($libBtnOuter) ->
    setMenuBtn($libBtnOuter)
  )
  $moduleBtnOuter = $menuBtnBox.dom('#moduleBtnOuter', ($moduleBtnOuter) ->
    setMenuBtn($moduleBtnOuter)
  )
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

  cf.router.regAftPage(->
    $window.on('scroll', ->
      pageHeight = cf.router.$page.height()
      scrollTop = $window.scrollTop()
      tm.to([$libBtnOuter, $moduleBtnOuter], 1,
        y: scrollTop / pageHeight * 50
      )
      return
    )
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