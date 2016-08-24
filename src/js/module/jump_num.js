
/*
亂數效果(數字會亂跳, 最後顯示結果)
 */
cf.regModule('cfJumpNum', function() {
  var $self;
  $self = this;

  /* 在指定的時間內, 數字會亂跳, 時間到會顯示目標數字 */
  $self.intervalNum = function(targetNum, opt) {
    var count, interval, ms, num, range, time, times;
    if (opt == null) {
      opt = {};
    }
    num = 0;

    /* 跳動的總時間(1秒) */
    time = opt.time || 1;

    /* 每幾毫秒跳一次 */
    ms = opt.ms || 100;

    /* 跳動的數字範圍 */
    range = opt.range || 100000;
    times = time * 1000 / ms;
    count = 0;
    interval = setInterval((function() {
      if (++count > times) {
        num = targetNum;
        clearInterval(interval);
      } else {
        num = caro.randomInt(range);
      }
      $self.html(num);
    }), ms);
  };

  /* 在指定的時間內, 數字會亂數增加到目標數字為止 */
  $self.intervalAddNm = function(targetNum, opt) {
    var interval, ms, num, range;
    if (opt == null) {
      opt = {};
    }
    num = 0;

    /* 每幾毫秒跳一次 */
    ms = opt.ms || 100;

    /* 每次增加的數字範圍 */
    range = opt.range || 1;
    interval = setInterval((function() {
      num += Math.ceil(Math.random() * range);
      if (num >= targetNum) {
        num = targetNum;
        clearInterval(interval);
      }
      $self.html(num);
    }), ms);
  };
  return $self;
});
