### img 切換圖片 ###
cf.regModule 'cfImgSwitch', (imgArr) ->
  $self = @
  currentIndex = 0
  interval = null

  ### 切換圖片 ###
  $self.switchImg = (i = currentIndex) ->
    i++
    i = 0 if i > imgArr.length - 1
    $self.src imgArr[i]
    currentIndex = i
    $self

  ### 自動切換圖片 ###
  $self.autoSwitch = (ms = 1000) ->
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