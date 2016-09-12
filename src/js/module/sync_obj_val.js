
/*
偵測 obj 的值並寫入對應的 html
 */
cf.regModule('cfWatch', function(obj) {
  var $self, caro, keyInHtmlArr, selfHtml, setHtml;
  $self = this;
  caro = cf.require('caro');
  selfHtml = $self.html();
  keyInHtmlArr = selfHtml.match(/{{\w+}}/g);
  setHtml = function(key, newVal) {
    var newHtml;
    newHtml = selfHtml;
    caro.forEach(keyInHtmlArr, function(keyInHtml) {
      var val;
      keyInHtml = keyInHtml.replace('{{', '').replace('}}', '');
      if (key && key === keyInHtml) {
        val = newVal;
      } else {
        val = obj[keyInHtml];
      }
      return newHtml = newHtml.replace(/{{\w+}}/, val);
    });
    return $self.html(newHtml);
  };
  caro.forEach(obj, function(val, key) {
    obj.watch(key, function(id, oldVal, newVal) {
      setHtml(id, newVal);
      return newVal;
    });
  });
  return setHtml();
});

cf.regDocReady(function() {
  if (!Object.prototype.watch) {
    Object.defineProperty(Object.prototype, 'watch', {
      enumerable: false,
      configurable: true,
      writable: false,
      value: function(prop, handler) {
        var getter, newval, oldval, setter;
        oldval = this[prop];
        newval = oldval;
        getter = function() {
          return newval;
        };
        setter = function(val) {
          oldval = newval;
          return newval = handler.call(this, prop, oldval, val);
        };
        if (delete this[prop]) {
          Object.defineProperty(this, prop, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true
          });
        }
      }
    });
  }
  if (!Object.prototype.unwatch) {
    Object.defineProperty(Object.prototype, 'unwatch', {
      enumerable: false,
      configurable: true,
      writable: false,
      value: function(prop) {
        var val;
        val = this[prop];
        delete this[prop];
        this[prop] = val;
      }
    });
  }
});
