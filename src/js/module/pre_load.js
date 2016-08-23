
/*
預載檔案
Depend on preloadjs-0.4.1
 */
cf.regModule('cfPreLoad', function(filePathArr, opt) {
  var $self, _onComplete, _onError, _onLoadStart, _onProgress, cf, createjs;
  if (opt == null) {
    opt = {};
  }
  $self = this;
  cf = $self.cf;
  createjs = cf.require('createjs');

  /* 開始讀取時觸發的 cb */
  _onLoadStart = opt.onLoadStart;

  /* 全部讀取完成時觸發的 cb */
  _onComplete = opt.onComplete;

  /* 發生錯誤時觸發的 cb */
  _onError = opt.onError;

  /* 進行讀取時觸發的 cb */
  _onProgress = opt.onProgress;

  /* 開始讀取檔案 */
  $self.startLoad = function() {
    var queue;
    queue = new createjs.LoadQueue(false);
    queue.on('loadstart', function(event) {
      _onLoadStart && _onLoadStart(event);
    });
    queue.on('complete', function(event) {
      _onComplete && _onComplete(event);
    });
    queue.on('error', function(event) {
      _onError && _onError(event);
    });
    queue.on('progress', function(event) {
      var progress;
      progress = event.progress;
      _onProgress && _onProgress(event, progress);
    });
    queue.loadManifest(filePathArr);
    return $self;
  };
  return $self;
});
