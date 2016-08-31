cf.router.regPage 'module/cfScroll', (cf) ->
  $page = @
  $ = cf.require('$')

  setInner = ($inner, index, color)->
    $inner.css(
      width: '97%'
      height: 80
      color: '#e5e5e5'
      'background-color': color
      'text-align': 'center'
      'padding-top': 20
    )
    $inner.append('<h2>' + index + '</h2>')

  $outer = $page.dom('#outer').css(
    height: 120
  )

  bgColorArr = cf.data('bgColorArr')
  $innerArr = []
  caro.forEach(bgColorArr, (color, i) ->
    index = i + 1
    $inner = $page.dom('#inner' + index)
    return unless $inner.length
    setInner($inner, index, color)
    $innerArr.push($inner)
    return
  )
  $outer.cfScroll($innerArr)

  $page.dom('#scrollToBtn1').onClick(->
    $outer.scrollTo(1)
    return
  )
  $page.dom('#scrollToBtn2').onClick(->
    $outer.scrollTo(3)
    return
  )
  $page.dom('#scrollNextBtn').onClick(->
    $outer.scrollNext()
    return
  )
  $page.dom('#scrollPrevBtn').onClick(->
    $outer.scrollPrev()
    return
  )

  $page