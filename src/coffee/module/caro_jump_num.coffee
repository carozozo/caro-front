### 亂數效果(數字會亂跳, 最後顯示結果) ###
cf.regModule 'caroJumpNum', ->
  $self = @

  ###
  在指定的時間內, 數字會亂跳, 時間到會顯示目標數字
  targetNum: 目標數字
  opt.maxSecond: 跳動的總時間(1秒)
  opt.ms: 每幾毫秒跳一次(100毫秒)
  ###
  $self.interval = (targetNum, opt) ->
    opt = opt or {}
    num = 0
    maxSecond = opt.maxSecond or 1
    ms = opt.ms or 100
    times = maxSecond * 1000 / ms
    count = 0
    interval = setInterval((->
      if ++count > times
        num = targetNum
        clearInterval interval
      else
        num = caro.randomInt(100000)
      $self.html num
      return
    ), ms)
    return

  ###
  在指定的時間內, 數字會亂數增加到目標數字為止
  targetNum: 目標數字
  opt.range: 跳動的數字範圍
  opt.ms: 每幾毫秒跳一次(100毫秒)
  ###
  $self.intervalAdd = (targetNum, opt) ->
    opt = opt or {}
    num = 0
    range = opt.range or targetNum
    ms = opt.ms or 100
    interval = setInterval((->
      num += parseInt(Math.random() * range)
      if num >= targetNum
        num = targetNum
        clearInterval interval
      $self.html num
      return
    ), ms)
    return

  $self