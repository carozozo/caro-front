
/* depend on preloadjs-0.4.1 */

/* 預載檔案 */
cf.regModule('cfPreLoad', function(files, _progressFn, _completeFn) {
  var $self, cf, createjs;
  $self = this;
  cf = $self.cf;
  createjs = cf.require('createjs');

  /* 開始讀取檔案 */
  $self.startLoad = function(cb) {
    var queue;
    queue = new createjs.LoadQueue(false);
    queue.on('complete', function() {
      _completeFn && _completeFn();
      return false;
    });
    queue.on('progress', function(event) {
      var progress;
      progress = event.progress;
      if (progress === 0) {
        return;
      }
      progress = Math.floor(progress * 100);
      if (progress > 100) {
        progress = 100;
      }
      _progressFn && _progressFn(progress);
    });
    queue.loadManifest(files);
    cb && cb();
    return $self;
  };
  return $self;
});
