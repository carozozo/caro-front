###
輪流顯示 DOM, 預設顯示第一個
$domList: 要顯示的 dom 列表
e.g. [$('#dom1'), $('#dom2')]
defType: 預設顯示方式 [fade/up/down/lef/right/'']
###
cf.regModule 'caroSwitchShow', ($domList, opt = {}) ->
  $self = @
  cf = $self.cf
  caro = cf.require('caro')
  tl = new TimelineLite()
  _defType = opt.defType or 'fade'
  _befShow = opt.befShow
  _aftShow = opt.aftShow
  _currentIndex = 0

  caro.forEach($domList, ($dom) ->
    $dom.hide()
    return
  )

  switchShow = (i, type, opt = {}) ->
    return if tl.isActive()
    type = type or _defType or 'fade'
    ### 移動時間 ###
    duration = opt.duration or 0.5
    ### 移動距離 ###
    distance = opt.distance or 30
    ### 轉換前的 cb ###
    befShow = opt.befShow or _befShow
    ### 轉換後的 cb, 如果回傳 false 則不轉換 ###
    aftShow = opt.aftShow or _aftShow

    callAftShow = ->
      aftShow and aftShow(_currentIndex, i)
      _currentIndex = i
      return

    $currentDom = $domList[_currentIndex]
    $targetDom = $domList[i]
    return if befShow and befShow(_currentIndex, i) is false

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
  $self.showDom = (index, type, opt) ->
    targetIndex = index;
    switchShow targetIndex, type, opt

  ### 顯示下一個內容 ###
  $self.next = (type, opt = {}) ->
    targetIndex = _currentIndex + 1
    targetIndex = 0 if targetIndex > $domList.length - 1
    switchShow targetIndex, type, opt

  ### 顯示上一個內容 ###
  $self.prev = (type, opt = {}) ->
    targetIndex = _currentIndex - 1
    targetIndex = $domList.length - 1 if targetIndex < 0
    switchShow targetIndex, type, opt

  $domList[_currentIndex].show()
  $self