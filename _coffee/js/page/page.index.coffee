cf.router.regPage 'index', (cf) ->
  $page = @
  window = cf.require('window')
  $ = cf.require('$')
  $page

cf.regDocReady((cf) ->
  $ = cf.require('$')
  $colors = $('#colors')
  bgColorArr = [
    $colors.find('.colorGray2').css('color')
    $colors.find('.colorGreen2').css('color')
    $colors.find('.colorRed2').css('color')
    $colors.find('.colorBlue2').css('color')
    $colors.find('.colorYellow2').css('color')
  ]
  titleSrcArr = [
    'images/cf_title1.png'
    'images/cf_title2.png'
    'images/cf_title3.png'
    'images/cf_title4.png'
    'images/cf_title5.png'
  ]

  cf.data('titleSrcArr', titleSrcArr)
  cf.data('bgColorArr', bgColorArr)
  return
, 1)