###
捲軸自動滑動到 DOM 定點的功能
Depend on plugin scrollTo of gsap
###
cf.regModule 'cfScroll', ($contents, opt = {}) ->
  $self = @
  caro = cf.require('caro')
  tm = cf.require('TweenMax')
  $self.$$offsetTopArr = _offsetTopArr = []
  _nowIndex = 0

  ### 綁定 scroll 的 name space ###
  _triggerName = 'scroll.cfScroll'

  ### 判定捲動到定點的 Y 軸基準線, 可以是回傳 num 的 fn, 預設為本身高度的一半 ###
  _basicY = opt.basicY or -> $self.height() / 2
  ### 每個 $content 的 top 基準位移 ###
  _offsetTop = opt.offsetTop or 0
  ### 是否要及時更新 top 資訊 ###
  _isLiveTop = opt.isLiveTop
  ### 捲動秒數, 設為 0 代表直接跳到該位置 ###
  _duration = unless caro.isUndefined(opt.duration) then opt.duration else 1
  ### gsap 捲動 ease 效果 ###
  _ease = opt.ease or Power2.easeOut
  ### 捲動前的 cb, return false 則不捲動 ###
  _befScroll = opt.befScroll
  ### 捲動時的 cb ###
  _onScroll = opt.onScroll
  ### 捲動後的 cb ###
  _aftScroll = opt.aftScroll

  getContentTop = ($content, i) ->
    selfTop = $self.offset().top
    eachTop = $content.offset().top
    eachTop -= selfTop + _offsetTop
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
    basicY = if caro.isFunction(_basicY) then _basicY() else _basicY
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
  $self.updateTop = ->
    caro.forEach($contents, getOffsetTopArr)
    $self

  ### 綁定 scroll ###
  $self.bindScroll = ->
    $self.on(_triggerName, (e) ->
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