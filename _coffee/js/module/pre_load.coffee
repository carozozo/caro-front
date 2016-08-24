###
預載檔案
Depend on preloadjs-0.4.1
###
cf.regModule 'cfPreLoad', (filePathArr, opt = {}) ->
  $self = @
  cf = $self.cf
  createjs = cf.require('createjs')
  ### 開始讀取時觸發的 cb ###
  _onLoadStart = opt.onLoadStart
  ### 全部讀取完成時觸發的 cb ###
  _onComplete = opt.onComplete
  ### 發生錯誤時觸發的 cb ###
  _onError = opt.onError
  ### 進行讀取時觸發的 cb ###
  _onProgress = opt.onProgress

  ### 開始讀取檔案 ###
  $self.startLoad = ->
    queue = new createjs.LoadQueue(false)
    queue.on 'loadstart', (event) ->
      _onLoadStart and _onLoadStart(event)
      return
    queue.on 'complete', (event)->
      _onComplete and _onComplete(event)
      return
    queue.on 'error', (event) ->
      _onError and _onError(event)
      return
    queue.on 'progress', (event) ->
      progress = event.progress
      _onProgress and _onProgress(event, progress)
      return
    queue.loadManifest filePathArr
    $self

  $self