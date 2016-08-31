###
輪流切換 DOM 內容, 預設顯示第一個, 其他透明度設為 0
Depend on gsap
###
cf.regModule 'cfSwitchShow', ($domList, opt = {}) ->
  ### $domList: 要顯示的 dom 列表, e.g. [$('#dom1'), $('#dom2')] ###
  $self = @
  cf = $self.cf
  caro = cf.require('caro')
  tl = new TimelineLite()
  ### defType: 預設顯示方式 [fade/up/down/lef/right/''] ###
  _defType = opt.defType or 'fade'
  ### 預設切換時間 ###
  _duration = opt.duration or 0.5
  ### 預設移動距離 ###
  _distance = opt.distance or 30
  ### 切換之前呼叫的 cb(), return false 則不切換 ###
  _befSwitch = opt.befSwitch
  ### 切換之後呼叫的 cb() ###
  _aftSwitch = opt.aftSwitch
  ### 目前所在的 index ###
  _currentIndex = 0

  caro.forEach($domList, ($dom, i) ->
    return unless i
    tl.set($dom,
      opacity: 0
    )
    return
  )

  switchShow = (i, type, opt = {}) ->
    return if tl.isActive()
    ### 顯示方式 ###
    type = type or _defType or 'fade'
    ### 移動時間 ###
    duration = opt.duration or _duration
    ### 移動距離 ###
    distance = opt.distance or _distance
    ### 切換前的 cb, return false 則不切換 ###
    befSwitch = opt.befSwitch or _befSwitch
    ### 切換後的 cb ###
    aftSwitch = opt.aftSwitch or _aftSwitch

    callAftShow = ->
      tl.set([$currentDom, $targetDom],
        x: 0
        y: 0
      )
      aftSwitch and aftSwitch(_currentIndex, i)
      _currentIndex = i
      return

    $currentDom = $domList[_currentIndex]
    $targetDom = $domList[i]
    return if befSwitch and befSwitch(_currentIndex, i) is false

    switch type
      when 'fade'
        tl.fromTo($currentDom, duration, {opacity: 1}, {opacity: 0})
        tl.fromTo($targetDom, duration, {opacity: 0}, {opacity: 1, onComplete: callAftShow})
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
        tl.set($currentDom, {opacity: 0})
        tl.set($targetDom, {opacity: 1, onComplete: callAftShow})
    $self

  ### index: 要顯示的目標, type: 指定顯示方式 [fade/up/down/lef/right/''] ###
  $self.switchDom = (index, type, opt) ->
    targetIndex = index;
    switchShow targetIndex, type, opt

  ### 顯示下一個內容 ###
  $self.showNext = (type, opt) ->
    targetIndex = _currentIndex + 1
    targetIndex = 0 if targetIndex > $domList.length - 1
    switchShow targetIndex, type, opt

  ### 顯示上一個內容 ###
  $self.showPrev = (type, opt) ->
    targetIndex = _currentIndex - 1
    targetIndex = $domList.length - 1 if targetIndex < 0
    switchShow targetIndex, type, opt

  $domList[_currentIndex]
  $self