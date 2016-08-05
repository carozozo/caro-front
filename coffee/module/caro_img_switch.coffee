### img 切換圖片 ###
cf.regModule 'caroImgSwitch', ->
  $self = @
  cf = $self.cf
  currentIndex = 0
  caro = cf.require('caro')
  imgArr = caro.values(arguments)
  interval = null

  ### 新增圖片路徑 ###
  $self.addImg = (imgSrc) ->
    imgArr.push imgSrc
    $self

  ### 切換圖片 ###
  $self.switchImg = (i) ->
    if caro.isUndefined(i)
      i = currentIndex
    if i > imgArr.length - 1
      i = 0
    $self.src imgArr[i]
    currentIndex = ++i
    $self

  ### 自動切換圖片 ###
  $self.autoSwitch = (ms) ->
    count = 0
    interval = setInterval((->
      src = imgArr[count]
      $self.src src
      count++
      count = 0 if count > imgArr.length - 1
      return
    ), ms)
    $self

  ### 停止切換圖片 ###
  $self.stopSwitch = ->
    clearInterval interval
    $self

  $self