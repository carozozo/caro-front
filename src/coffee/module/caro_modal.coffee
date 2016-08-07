### modal 視窗 ###
cf.regModule 'caroModal', (opt = {}) ->
  $self = @
  cf = $self.cf
  $body = cf.$body
  $ = cf.require('$')
  ### 是否點選內容之外的部分就 close modal ###
  _isClickClose = if opt.isClickClose is false then opt.isClickClose else true
  moduleData = do ->
    unless cf.data('caroModal')
      cf.data 'caroModal',
        index: 1
        zIndex: 99999
    cf.data 'caroModal'
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
    $('<div></div>').attr('id', 'caro-modal-background' + _index)
    .css(
      opacity: 0.8
      'background-color': '#000'
    ).css(_basicStyle).hide()

  $inner = do ($) ->
    selfWidth = $self.clone().appendTo('body').wrap('<div style="display: none"></div>').css('width') or $self.width()
    $self.css(
      width: '100%'
    )
    $('<div></div>').attr('id', 'caro-modal-inner' + _index).css(
      width: selfWidth
      'margin-left': 'auto'
      'margin-right': 'auto'
      position: 'relative'
      top: '50%'
      transform: 'translateY(-50%)'
    ).append($self)

  $outer = do($) ->
    $('<div></div>').attr('id', 'caro-modal-outer' + _index)
    .css(_basicStyle).on('click', (e) ->
      return unless _isClickClose and e.target is @
      $self.closeModal()
    ).append($inner).hide()

  $body.append($background).append($outer)
  moduleData.index++
  moduleData.zIndex += 2

  ### 顯示視窗 ###
  $self.showModal = ->
    $body.css(
      overflow: 'hidden'
    )
    $background.show()
    $outer.fadeIn()
    return

  ### 關閉視窗 ###
  $self.closeModal = ->
    $body.css(
      overflow: 'auto'
    )
    $outer.fadeOut ->
      $background.hide()
      return
    return

  $self