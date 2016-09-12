###
亂數效果(數字會亂跳, 最後顯示結果)
###
cf.regModule 'cfJumpNum', ->
  $self = @
  caro = cf.require('caro')

  ### 在指定的時間內, 數字會亂跳, 時間到會顯示目標數字 ###
  $self.intervalNum = (targetNum, opt = {}) ->
    num = 0
    ### 跳動的總時間(1秒) ###
    time = opt.time or 1
    ### 每幾毫秒跳一次 ###
    ms = opt.ms or 100
    ### 跳動的數字範圍 ###
    range = opt.range or 100000
    times = time * 1000 / ms
    count = 0
    interval = setInterval((->
      if ++count > times
        num = targetNum
        clearInterval interval
      else
        num = caro.randomInt(range)
      $self.html num
      return
    ), ms)
    return

  ### 在指定的時間內, 數字會亂數增加到目標數字為止 ###
  $self.intervalAddNm = (targetNum, opt = {}) ->
    num = 0
    ### 每幾毫秒跳一次 ###
    ms = opt.ms or 100
    ### 每次增加的數字範圍 ###
    range = opt.range or 1
    interval = setInterval((->
      num += Math.ceil(Math.random() * range)
      if num >= targetNum
        num = targetNum
        clearInterval interval
      $self.html num
      return
    ), ms)
    return

  $self