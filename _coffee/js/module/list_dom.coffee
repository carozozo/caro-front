###
將 object-array 資料放到 DOM, 以 list 方式呈現, 例如得獎名單
DOM 本身需要寫入 [listKey='xxx'] 標籤, 用來對應 object 裡面的 key
###
cf.regModule 'cfListDom', (objArr, opt = {}) ->
  $self = @
  caro = cf.require('caro')
  ### 每次置入 DOM 之前會呼叫的 cb(object,index,DOM); 回傳 true 會跳過, false 則停止繼續寫入下一筆 ###
  befInsert = opt.befInsert
  ### 每次置入 DOM 之後會呼叫的 cb(object,index,DOM) ###
  aftInsert = opt.aftInsert
  ### list DOM 是否是放在 after ###
  isAfter = if opt.isAfter is false then false else true
  cf.reverse(objArr)
  caro.forEach(objArr, (data, i) ->
    $clone = $self.clone()
    if befInsert
      cbResult = befInsert(data, i, $clone)
      return false if cbResult is false
      return true if cbResult is true
    caro.forEach(data, (val, key) ->
      $column = $clone.find('[listKey="' + key + '"]')
      $column.html(val)
    )
    if isAfter
      $self.after($clone)
    else
      $self.before($clone)
    aftInsert and aftInsert(data, i, $clone)
    return
  )
  $self