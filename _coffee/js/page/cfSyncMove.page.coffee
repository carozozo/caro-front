cf.router.regPage 'module/cfSyncMove', (cf, $page) ->
  bgColorArr = cf.data('bgColorArr')
  setBlock = ($block, color) ->
    $block.css(
      width: 120
      height: 120
      display: 'inline-block'
      'margin-left': 50
      'background-color': color
    )
    return

  getBaseY = -> cf.$window.height() / 2
  $infoBox = $page.dom('#infoBox')
  $block1 = $page.dom('#block1').cfSyncMove('block1',
    befMove: (infoObj)->
      delete infoObj.$self
      delete infoObj.event
      $infoBox.html(JSON.stringify(infoObj))
      return
  )
  $block2 = $page.dom('#block2').cfSyncMove('block2',
    baseY: getBaseY
  )
  $block3 = $page.dom('#block3').cfSyncMove('block3',
    baseX: false
    baseY: getBaseY
  )

  setBlock($block1, bgColorArr[0])
  setBlock($block2, bgColorArr[1])
  setBlock($block3, bgColorArr[2])

  $page.dom('#startBtn').onClick(->
    $block1.startSyncMove()
    $block2.startSyncMove()
    $block3.startSyncMove()
  ).click()
  $page.dom('#stopBtn').onClick(->
    $block1.stopSyncMove()
    $block2.stopSyncMove()
    $block3.stopSyncMove()
  )

  $page