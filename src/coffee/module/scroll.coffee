### 捲軸自動滑動到 DOM 定點 的功能 ###
cf.regModule 'cfScroll', ($contents, opt = {}) ->
  $self = @
  cf = $self.cf
  $window = cf.$window
  caro = cf.require('caro')
  tm = cf.require('TweenMax')
  $self.$$offsetTopArr = _offsetTopArr = []
  _nowIndex = 0

  ### Y 軸基準線 ###
  _basicY = opt.basicY
  ### 每個 dom 的 top 基準位移 ###
  _offsetTop = opt.offsetTop or 0
  ### 是否要及時更新 top 資訊 ###
  _isLiveTop = opt.isLiveTop
  ### 捲動時間 ###
  _duration = unless caro.isUndefined(opt.duration) then opt.duration else 1
  ### 捲動 ease 效果 ###
  _ease = opt.ease or Power2.easeOut
  ### 綁定 scroll 的 name space ###
  _triggerName = if opt.triggerName then 'scroll.cfScroll.' + opt.triggerName else 'scroll.cfScroll'
  ### 捲動前的 cb ###
  _befScroll = opt.befScroll
  ### 捲動時的 cb ###
  _onScroll = opt.onScroll
  ### 捲動後的 cb ###
  _aftScroll = opt.aftScroll

  getContentTop = ($content, i) ->
    eachTop = $content.position().top
    eachTop -= _offsetTop
    _offsetTopArr[i] = eachTop
    return

  getOffsetTopArr = ->
    caro.forEach($contents, getContentTop)
    return

  scrollToNowIndex = (duration = null) ->
    getOffsetTopArr() if _isLiveTop
    offset = _offsetTopArr[_nowIndex]
    duration = _duration if duration is null
    tm.to($self, duration, {
      scrollTo: {y: offset}
      ease: _ease
    })
    return

  ### 取得現在所在的 index ###
  $self.getNowIndex = ->
    scrollTop = $self.scrollTop()
    basicY = null
    if _basicY
      basicY = if caro.isFunction(_basicY) then _basicY() else _basicY
    else
      basicY = $window.height() / 2
    caro.forEach(_offsetTopArr, (offsetTop, i) ->
      ### Dom 的頂端超過基準值時, 視為閱覽當下的 Dom ###
      _nowIndex = i if scrollTop + basicY >= offsetTop
      return
    )
    _nowIndex

  ### 捲動到下一個 ###
  $self.scrollNext = (duration) ->
    _nowIndex = 0 if ++_nowIndex > _offsetTopArr.length - 1
    scrollToNowIndex(duration)
    $self

  ### 捲動到上一個 ###
  $self.scrollPrev = (duration) ->
    _nowIndex = _offsetTopArr.length - 1 if --_nowIndex < 0
    scrollToNowIndex(duration)
    $self

  ### 捲動到指定的 index ###
  $self.scrollTo = (i, duration) ->
    _nowIndex = i
    scrollToNowIndex(duration)
    $self

  ### 重新掃描內容的高度位置 ###
  $self.updatePosition = ->
    caro.forEach($contents, getOffsetTopArr)
    $self

  ### 綁定 scroll ###
  $self.bindScroll = ->
    ### 避免重複綁定 ###
    $self.off(_triggerName).on(_triggerName, (e) ->
      return false if _nowIndex isnt null and _befScroll and _befScroll(_nowIndex, e) is false
      ### 偵測 scroll stop ###
      clearTimeout($self.data("scrollCheck." + _triggerName));
      $self.getNowIndex()
      _onScroll and _onScroll(_nowIndex, e)
      $self.data("scrollCheck." + _triggerName, setTimeout(->
        _aftScroll and _aftScroll(_nowIndex, e)
      , 250))
      return
    )
    $self

  ### 不綁定 scroll ###
  $self.unbindScroll = ->
    $self.off(_triggerName)
    $self

  getOffsetTopArr()
  $self.bindScroll()
  $self.getNowIndex()

  $self