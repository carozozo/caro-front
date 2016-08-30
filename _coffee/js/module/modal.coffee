###
modal 視窗
###
cf.regModule 'cfModal', (opt = {}) ->
  $self = @
  cf = $self.cf
  $body = cf.$body
  $ = cf.require('$')
  ### 是否點選內容之外的部分就 close modal ###
  _isClickClose = if opt.isClickClose is false then false else true
  ### 顯示視窗之前觸發的 cb, return false 則不顯示 ###
  _befShow = opt.befShow
  ### 顯示視窗之後觸發的 cb ###
  _aftShow = opt.aftShow
  ### 關閉視窗之前觸發的 cb, return false 則不關閉 ###
  _befHide = opt.befHide
  ### 關閉視窗之後觸發的 cb ###
  _aftHide = opt.aftHide
  moduleData = do ->
    unless cf.data('cfModal')
      cf.data 'cfModal',
        index: 1
        zIndex: 99999
    cf.data 'cfModal'
  _index = moduleData.index
  _zIndex = moduleData.zIndex
  _basicStyle =
    position: 'fixed'
    top: 0
    left: 0
    width: '100%'
    height: '100%'
    'z-index': ++_zIndex

  $background = do ($) ->
    $('<div></div>').attr('id', 'cf-modal-background' + _index)
    .css(
      opacity: 0.8
      'background-color': '#000'
    ).css(_basicStyle).hide()

  $inner = do ($) ->
    getStyleWidth = ($dom) ->
      $div = $('<div/>').hide()
      $clone = $dom.clone()
      $('body').append($div.append($clone))
      width = $clone.css('width')
      $div.remove()
      width

    selfWidth = getStyleWidth($self) or $self.width()
    $self.css(
      width: '100%'
    )
    $('<div></div>').attr('id', 'cf-modal-inner' + _index).css(
      width: selfWidth
      'margin-left': 'auto'
      'margin-right': 'auto'
      position: 'relative'
      top: '50%'
      transform: 'translateY(-50%)'
      'max-width': '100%'
      'max-height': '100%'
    ).append($self)

  $outer = do($) ->
    $('<div></div>').attr('id', 'cf-modal-outer' + _index)
    .css(_basicStyle).css(
      overflow: 'auto'
    ).on('click', (e) ->
      return unless _isClickClose and e.target is @
      $self.hideModal()
    ).append($inner).hide()

  $body.append($background).append($outer)
  moduleData.index++
  moduleData.zIndex += 2

  ### 顯示視窗 ###
  $self.showModal = (opt = {}) ->
    befShow = opt.befShow
    aftShow = opt.aftShow
    return if befShow and befShow() is false
    return if _befShow and _befShow() is false
    $body.css(
      overflow: 'hidden'
    )
    $background.show()
    $outer.fadeIn(->
      aftShow and aftShow() is false
      _aftShow and _aftShow()
    )
    return

  ### 關閉視窗 ###
  $self.hideModal = (opt = {}) ->
    befHide = opt.befHide
    aftHide = opt.aftHide
    return if befHide and befHide() is false
    return if _befHide and _befHide() is false
    $body.css(
      overflow: 'auto'
    )
    $background.fadeOut()
    $outer.fadeOut(->
      aftHide and aftHide()
      _aftHide and _aftHide()
      return
    )
    return

  $self