### img 切換圖片 ###
cf.regModule 'caroImgSwitch', ->
  $self = this
  cf = $self.cf
  currentIndex = 0
  caro = cf.require('caro')
  imgArr = caro.values(arguments)
  interval = null

  $self.addImg = (imgSrc) ->
    imgArr.push imgSrc
    return

  $self.switchImg = (i) ->
    if caro.isUndefined(i)
      i = currentIndex
    if i > imgArr.length - 1
      i = 0
    $self.src imgArr[i]
    currentIndex = ++i
    return

  $self.autoSwitch = (ms) ->
    count = 0
    interval = setInterval((->
      src = imgArr[count]
      $self.src src
      count++
      if count > imgArr.length - 1
        count = 0
      return
    ), ms)
    return

  $self.stop = ->
    clearInterval interval
    return

  $self