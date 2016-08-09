
/* 將 array 資料放到 DOM, 以 list 方式呈現, 例如得獎名單 */
cf.regModule('cfListDom', function(targetSelector, listData, opt) {
  var $self, $target, cb;
  if (opt == null) {
    opt = {};
  }
  $self = this;
  cb = opt.cb || null;
  $target = $self.find(targetSelector).hide();
  caro.forEach(listData, function(data) {
    var $clone;
    $clone = $target.clone();
    if (!cb || !(cb($clone, data) === false)) {
      caro.forEach(data, function(val, key) {
        return $clone.find('.' + key).html(val);
      });
    }
    return $self.append($clone.show());
  });
  return $self;
});
