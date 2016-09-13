###
偵測 obj 的值並寫入對應的 html
###
cf.regModule 'cfSyncObjVal', (obj) ->
  $self = @
  caro = cf.require('caro')

  if $self.data('selfHtml')
    selfHtml = $self.data('selfHtml')
    keyInHtmlArr = $self.data('keyInHtmlArr')
  else
    selfHtml = $self.html()
    keyInHtmlArr = selfHtml.match(/{{\w+}}/g)
    $self.data('selfHtml', selfHtml)
    $self.data('keyInHtmlArr', keyInHtmlArr)

  setHtml = (key, newVal) ->
    newHtml = selfHtml
    caro.forEach(keyInHtmlArr, (keyInHtml) ->
      keyInHtml = keyInHtml.replace('{{', '').replace('}}', '')
      if key and key is keyInHtml
        val = newVal
      else
        val = obj[keyInHtml]
      newHtml = newHtml.replace(/{{\w+}}/, val)
    )
    $self.html(newHtml)

  caro.forEach(obj, (val, key) ->
    obj.watch(key, (id, oldVal, newVal) ->
      setHtml(id, newVal)
      newVal
    )
    return
  )

  setHtml()

cf.regDocReady ->
  if !Object::watch
    Object.defineProperty Object.prototype, 'watch',
      enumerable: false
      configurable: true
      writable: false
      value: (prop, handler) ->
        oldval = @[prop]
        newval = oldval

        getter = ->
          newval

        setter = (val) ->
          oldval = newval
          newval = handler.call(this, prop, oldval, val)

        if delete @[prop]
          Object.defineProperty this, prop,
            get: getter
            set: setter
            enumerable: true
            configurable: true
        return
  if !Object::unwatch
    Object.defineProperty Object.prototype, 'unwatch',
      enumerable: false
      configurable: true
      writable: false
      value: (prop) ->
        val = @[prop]
        delete @[prop]
        # remove accessors
        @[prop] = val
        return
  return