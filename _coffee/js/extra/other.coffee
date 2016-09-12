cf.regDocReady((cf) ->
  $ = cf.require('$')
  $colors = $('#colors')
  bgColorArr = []
  $colors.find('div').each((i, ele) ->
    $div = $(ele)
    bgColorArr.push($div.css('color'))
  )
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