### depend on preloadjs-0.4.1 ###
### 預載檔案 ###
cf.regModule 'caroPreLoad', (files, _progressFn, _completeFn) ->
  $self = this
  cf = $self.cf
  createjs = cf.require('createjs')

  $self.startLoad = (cb)->
    queue = new createjs.LoadQueue(false)
    queue.on 'complete', ->
      _completeFn and _completeFn()
      false
    queue.on 'progress', (event) ->
      progress = event.progress
      if progress == 0
        return
      progress = Math.floor(progress * 100)
      if progress > 100
        progress = 100
      _progressFn and _progressFn(progress)
      return
    queue.loadManifest files
    cb and cb()
    $self
  $self