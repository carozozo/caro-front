### modal 視窗 ###
cf.regModule 'caroModal', (opt) ->
  $self = @
  cf = $self.cf
  $ = cf.require('$')
  moduleData = do ->
    if !cf.data('caroModal')
      cf.data 'caroModal',
        index: 1
        zIndex: 900
    cf.data 'caroModal'
  _index = moduleData.index
  _zIndex = moduleData.zIndex
  basicStyle =
    position: 'absolute'
    top: 0
    left: 0
    'z-index': ++_zIndex
  style = opt.style or {}
  backgroundStyle = opt.backgroundStyle or {}
  $closeBtn = opt.$closeBtn
  $background = do ($) ->
    $dom = $('<div></div>').attr('id', 'caro-modal-background' + _index).css(
      width: '100%'
      height: '100%'
      opacity: 0.8
      'background-color': '#000').hide()
    $dom.css(backgroundStyle).css basicStyle
  $container = do ($) ->
    $dom = $('<div></div>').attr('id', 'caro-modal-container' + _index).css(
      width: '100%'
      height: '100%'
      overflow: 'auto'
      'text-align': 'center').hide()
    $dom.css(style).css basicStyle
  $('body').append($background).append $container
  moduleData.index++
  moduleData.zIndex += 2

  ### 顯示視窗 ###
  $self.showModal = ->
    $content = $($self.html())
    $container.append $content
    if $closeBtn
      $container.append $closeBtn
    $background.show()
    $container.fadeIn()
    return

  ### 關閉視窗 ###
  $self.closeModal = ->
    $container.fadeOut ->
      if $closeBtn
        $background.append $closeBtn
      $background.hide()
      $container.html ''
      return
    return

  $self.hide()