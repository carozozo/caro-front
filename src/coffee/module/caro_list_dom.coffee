### 將 array 資料放到 DOM, 以 list 方式呈現, 例如得獎名單 ###
cf.regModule 'caroListDom', (targetSelector, listData, opt = {}) ->
  $self = @
  cb = opt.cb or null
  $target = $self.find(targetSelector).hide()
  caro.forEach(listData, (data) ->
    $clone = $target.clone()
    if(!cb or !(cb($clone, data) is false))
      caro.forEach(data, (val, key) ->
        $clone.find('.' + key).html(val)
      )
    $self.append($clone.show())
  )
  $self