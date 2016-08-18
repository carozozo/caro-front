cf.router.regPage 'module/cfImgSwitch', (cf, $page) ->
  titleSrcArr = cf.data('titleSrcArr')

  $page.dom('#imgBox').css(
    width: 340
    padding: 20
    margin: '0 auto'
  )
  $img = $page.dom('#img').cfImgSwitch(titleSrcArr).src(titleSrcArr[0])

  $page.dom('#switchImgBtn').onClick(->
    $img.switchImg()
    return
  )
  $page.dom('#switchImg1Btn').onClick(->
    $img.switchImg(1)
    return
  )
  $page.dom('#autoSwitchBtn').onClick(->
    $img.autoSwitch()
    return
  )
  $page.dom('#stopSwitchBtn').onClick(->
    $img.stopSwitch()
    return
  )
  $page
