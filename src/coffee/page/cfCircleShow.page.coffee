cf.router.regPage 'module/cfCircleShow', (cf, $page) ->
  window = cf.require('window')

  colorArr = ['#828282', '#608020', '#80161a', '#217284']
  $demo1 = $page.dom('#demo1').css(
    position: 'absolute'
    'margin-top': 20
    'margin-left': 20
    height: 1500
  )
  $circleDom = $page.dom('.circleDom').mapDom(($dom, i)->
    $dom.css(
      width: 100
      height: 120
      background: colorArr[i % colorArr.length]
    )
    return
  )
  $currentIndex = $page.dom('#currentIndex')
  $demo1.cfCircleShow($circleDom,
    radios: 120
    degreeTop: 20
    minScale: .8
  )

  $page.dom('#nextBtn').onClick(->
    $demo1.stopPlay()
    $demo1.next()
    return
  )
  $page.dom('#prevBtn').onClick(->
    $demo1.stopPlay()
    $demo1.prev()
    return
  )
  $page.dom('#autoPlay1Btn').onClick(->
    $demo1.stopPlay()
    $demo1.autoPlay()
    return
  )
  $page.dom('#autoPlay2Btn').onClick(->
    $demo1.stopPlay()
    $demo1.autoPlay(1000, false)
    return
  )
  $page.dom('#stopPlayBtn').onClick(->
    $demo1.stopPlay()
    return
  )
  $page.dom('#getCurrentIndexBtn').onClick(->
    $currentIndex.html($demo1.getCurrentIndex())
    return
  )

  $page
