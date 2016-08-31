cf.router.regPage 'module/cfPreLoad', ->
  $page = @
  fileArr = [
    'cf_title1.png'
    'cf_title2.png'
    'cf_title3.png'
    'no_such_file.png'
    'cf_title4.png'
    'cf_title5.png'
  ]
  fileArr = caro.map(fileArr, (file)-> 'images/' + file)
  $percentage = $page.dom('#percentage')
  $process = $page.dom('#process')
  $page.cfPreLoad(fileArr,
    onLoadStart: (e)->
      $process.append('start-> ')
      return
    onComplete: (e)->
      $process.append('complete')
      return
    onError: (e)->
      $process.append('error: ' + e.item.src + '-> ')
      return
    onProgress: (e, progress)->
      percentage = Math.round(progress * 100)
      $percentage.html(percentage)
      $process.append('progress: ' + percentage + '%-> ')
      return
  )

  $page.dom('#startLoadBtn').onClick(->
    $process.empty()
    $page.startLoad()
  )
  $page