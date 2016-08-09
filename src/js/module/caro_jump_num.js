
/* 亂數效果(數字會亂跳, 最後顯示結果) */
cf.regModule('cfJumpNum', function() {
  var $self;
  $self = this;

  /*
  在指定的時間內, 數字會亂跳, 時間到會顯示目標數字
  targetNum: 目標數字
  opt.maxSecond: 跳動的總時間(1秒)
  opt.ms: 每幾毫秒跳一次(100毫秒)
   */
  $self.interval = function(targetNum, opt) {
    var count, interval, maxSecond, ms, num, times;
    opt = opt || {};
    num = 0;
    maxSecond = opt.maxSecond || 1;
    ms = opt.ms || 100;
    times = maxSecond * 1000 / ms;
    count = 0;
    interval = setInterval((function() {
      if (++count > times) {
        num = targetNum;
        clearInterval(interval);
      } else {
        num = caro.randomInt(100000);
      }
      $self.html(num);
    }), ms);
  };

  /*
  在指定的時間內, 數字會亂數增加到目標數字為止
  targetNum: 目標數字
  opt.range: 跳動的數字範圍
  opt.ms: 每幾毫秒跳一次(100毫秒)
   */
  $self.intervalAdd = function(targetNum, opt) {
    var interval, ms, num, range;
    opt = opt || {};
    num = 0;
    range = opt.range || targetNum;
    ms = opt.ms || 100;
    interval = setInterval((function() {
      num += parseInt(Math.random() * range);
      if (num >= targetNum) {
        num = targetNum;
        clearInterval(interval);
      }
      $self.html(num);
    }), ms);
  };
  return $self;
});
