cf.router.regPage 'index', (cf, $page) ->
  window = cf.require('window')
  caro = cf.require('caro')
  $ = cf.require('$')

  $page

cf.regDocReady (cf)->
  $ = cf.require('$')
  tm = cf.require('TweenMax')

  $header = $('header')
  $headerTitle = $('#headerTitle').dom()
  bgColorArr = [
    '#464646'
    '#354712'
    '#460c0f'
    '#123f49'
    '#3b3b00'
  ]
  titleSrcArr = [
    'images/cf_title1.png'
    'images/cf_title2.png'
    'images/cf_title3.png'
    'images/cf_title4.png'
    'images/cf_title5.png'
  ]

  $headerTitle.onClick ->
    cf.router.goPage('index')
    return

  cf.router.regPrePage(->
    color = caro.randomPick(bgColorArr)
    tm.to($header, 1
      backgroundColor: color
    )
    return
  )

  cf.data('titleSrcArr', titleSrcArr)
  cf.data('bgColorArr', bgColorArr)

  return