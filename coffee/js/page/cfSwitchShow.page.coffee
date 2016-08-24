cf.router.regPage 'module/cfSwitchShow', (cf, $page) ->
  setInner = ($inner, index, color)->
    $inner.css(
      width: '18%'
      height: 100
      color: '#e5e5e5'
      'background-color': color
      'text-align': 'center'
      'padding-top': 20
    )
    $inner.append('<h2>' + index + '</h2>')

  $outer1 = $page.dom('#outer1').css(
    height: 120
    position: 'relative'
  )
  $outer2 = $page.dom('#outer2').css(
    height: 120
    position: 'relative'
  )

  bgColorArr = cf.data('bgColorArr')
  $innerArr1 = []
  $innerArr2 = []

  $page.dom('.inner1').eachDom(($inner, i)->
    index = i + 1
    color = bgColorArr[i]
    setInner($inner, index, color)
    $innerArr1.push($inner)
    $inner.css(
      position: 'absolute'
      top: 0
      left: 0
    )
  )
  $page.dom('.inner2').eachDom(($inner, i)->
    index = i + 1
    color = bgColorArr[i]
    setInner($inner, index, color)
    $innerArr2.push($inner)
    $inner.css(
      display: 'inline-block'
    )
  )

  $outer1.cfSwitchShow($innerArr1)
  $outer2.cfSwitchShow($innerArr2)

  $selectType = $page.dom('#selectType')
  $page.dom('#nextShowBtn').onClick(->
    selectType = $selectType.val()
    $outer1.showNext(selectType)
    $outer2.showNext(selectType)
    return
  )
  $page.dom('#prevShowBtn').onClick(->
    selectType = $selectType.val()
    $outer1.showPrev(selectType)
    $outer2.showPrev(selectType)
    return
  )

  $page