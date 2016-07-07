###
輪流顯示 DOM, 預設顯示第一個
$domList: 要顯示的 dom 列表
e.g. $('.domList')
e.g. [$('#dom1'), $('#dom2')]
defType: 預設顯示方式 [fade/up/down/lef/right/'']
###
cf.regModule 'caroSwitchShow', ($domList, defType) ->
  $self = this
  cf = $self.cf
  caro = cf.require('caro')
  tl = new TimelineLite()
  defType = defType or 'fade'
  currentIndex = 0
  targetIndex = 0

  $domList = cf.unit.coverDomList $domList, ($dom) ->
    $dom.hide()
    return

  switchShow = (i, type, opt = {}) ->
    return if tl.isActive()
    type = type or defType or 'fade'
    duration = opt.duration or 0.5
    distance = opt.distance or 30
    befShow = opt.befShow
    aftShow = opt.aftShow

    callAftShow = ->
      aftShow and aftShow(i)
      return

    ### 舊瀏覽器只支援 [fade/null] ###
    if cf.isBefIe8
      type = if ((type is 'fade') or (not type)) then type else 'fade'
    $currentDom = $domList[currentIndex]
    $targetDom = $domList[i]
    currentIndex = i

    befShow and befShow(i)

    switch type
      when 'fade'
        $currentDom.fadeOut ->
          $targetDom.fadeIn(callAftShow)
          return
      when 'up'
        $targetDom.show()
        tl.fromTo($currentDom, duration, {opacity: 1}, {opacity: 0, y: -distance})
        tl.fromTo($targetDom, duration, {opacity: 0, y: distance}, {opacity: 1, y: 0, onComplete: callAftShow})
      when 'down'
        $targetDom.show()
        tl.fromTo($currentDom, duration, {opacity: 1}, {opacity: 0, y: distance})
        tl.fromTo($targetDom, duration, {opacity: 0, y: -distance}, {opacity: 1, y: 0, onComplete: callAftShow})
      when 'left'
        $targetDom.show()
        tl.fromTo($currentDom, duration, {opacity: 1}, {opacity: 0, x: -distance})
        tl.fromTo($targetDom, duration, {opacity: 0, x: distance}, {opacity: 1, x: 0, onComplete: callAftShow})
      when 'right'
        $targetDom.show()
        tl.fromTo($currentDom, duration, {opacity: 1}, {opacity: 0, x: distance})
        tl.fromTo($targetDom, duration, {opacity: 0, x: -distance}, {opacity: 1, x: 0, onComplete: callAftShow})
      when 'normal'
        tl.set([$currentDom, $targetDom], {opacity: 1})
        $currentDom.hide()
        $targetDom.show()
        setTimeout(callAftShow)
    $self

  ### index: 要顯示的目標, type: 指定顯示方式 [fade/up/down/lef/right/''] ###
  ### opt.duration: 移動時間, opt.distance: 移動距離 ###
  $self.showDom = (index, type, opt) ->
    targetIndex = index;
    switchShow targetIndex, type, opt

  $self.next = (type, opt = {}) ->
    targetIndex = currentIndex + 1
    if targetIndex > $domList.length - 1
      targetIndex = 0
    switchShow targetIndex, type, opt

  $self.prev = (type, opt = {}) ->
    targetIndex = currentIndex - 1
    if targetIndex < 0
      targetIndex = $domList.length - 1
    switchShow targetIndex, type, opt

  $domList[currentIndex].show()
  $self