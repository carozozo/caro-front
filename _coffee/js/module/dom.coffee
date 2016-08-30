###
DOM 選取器, 支援一些方便的程式
###
cf.regModule 'dom', (selector, cb) ->
  $self = {}
  caro = cf.require('caro')
  window = cf.require('window')
  $ = cf.require('$')

  if caro.isFunction(selector)
    cb = selector
    selector = null
  if selector
    $self = @find(selector)
  else
    $self = @

  ### 屬性相關 ###
  do ->
    ### 設置/取得 id ###
    $self.id = (id) ->
      if id isnt undefined
        @attr 'id', id
        return @
      @attr 'id'
    ### 設置/取得 name ###
    $self.name = (name) ->
      if name isnt undefined
        @attr 'name', name
        return @
      @attr 'name'
    ### 設置/取得 class ###
    $self.aClass = (sClass) ->
      if sClass isnt undefined
        @addClass sClass
        return @
      @attr 'class'
    ### 設置/取得 title ###
    $self.title = (title) ->
      if title isnt undefined
        @attr 'title', title
        return @
      @attr 'title'
    ### 設置/取得 type ###
    $self.type = (type) ->
      if type isnt undefined
        @attr 'type', type
        return @
      @attr 'type'
    ### 設置/取得 src ###
    $self.src = (src) ->
      if src isnt undefined
        @attr 'src', src
        return @
      @attr 'src'
    ### 設置/取得 href ###
    $self.href = (href, target) ->
      if href isnt undefined
        @attr 'href', href
        if target isnt undefined
          @attr 'target', target
        return @
      @attr 'href'
    ### 是否為可見 ###
    $self.ifVisible = ->
      @is ':visible'
    ### 是否為隱藏 ###
    $self.ifHidden = ->
      !@is(':visible')
    ### 設為 enable ###
    $self.enable = ->
      @prop 'disabled', false
      @
    ### 設為 disable ###
    $self.disable = ->
      @prop 'disabled', true
      @
    ### 設為 checked / unchecked ###
    $self.setChecked = (bool = true) ->
      @prop 'checked', bool
      @
    ### 是否為 checked ###
    $self.ifChecked = ->
      @is ':checked'

    return

  ### css 相關 ###
  do ->
    ### 取得 css 設置的 top/left/right/bottom...等距離 ###
    $self.getCssDistance = (cssType) ->
      px = @css(cssType)
      parseInt px.replace('px')
    ### 取得 css 的屬性 ###
    $self.getCss = (type) ->
      $div = $('<div/>').hide()
      $clone = @clone()
      $('body').append($div.append($clone))
      css = $clone.css(type)
      $div.remove()
      css
    ### 設置滑鼠指標 ###
    $self.setCursor = (cursor) ->
      cursor = cursor or 'pointer'
      @css cursor: cursor
    return

  ### UI 操作 ###
  do($) ->
    ### 觸發 blur 後, 將裡面的值轉大寫 ###
    $self.blurUpperCase = (nameSpace) ->
      triggerName = 'blur'
      triggerName += '.' + nameSpace if nameSpace
      @on(triggerName, ->
        $dom = $(@)
        val = $dom.val().trim().toUpperCase()
        $dom.val(val)
      )
    ### 先 off 然後 on ###
    $self.action = (eve, fn) ->
      @off(eve).on(eve, (e) ->
        fn(e)
        return
      )
    ### on('click') 方便使用版 ###
    $self.onClick = (fn, nameSpace) ->
      triggerName = 'click'
      triggerName += '.' + nameSpace if nameSpace
      @setCursor().off(triggerName).on(triggerName, fn)
    ### 按下 Enter 鍵後觸發的 fn ###
    $self.onPressEnter = (fn, nameSpace) ->
      triggerName = 'keyup'
      triggerName += '.' + nameSpace if nameSpace
      @on(triggerName, (e) ->
        fn(e) if(e.which is 13)
        return
      )
    ### 按下 Esc 鍵後觸發的 fn ###
    $self.onPressEsc = (fn, nameSpace) ->
      triggerName = 'keyup'
      triggerName += '.' + nameSpace if nameSpace
      @on(triggerName, (e) ->
        fn(e) if(e.which is 27)
        return
      )
    return

  ### Unit 相關 ###
  do($) ->
    ### .each() 進階版, 直接賦予 dom 屬性 ###
    $self.eachDom = (cb) ->
      $self.each (i, element) ->
        $dom = $(element).dom()
        cb and cb($dom, i)
    ### .each() 進階版, 直接賦予 dom 屬性, 並回傳 dom array ###
    $self.coverToArr = (cb) ->
      arr = []
      $self.each (i, element) ->
        $dom = $(element).dom()
        cb and cb($dom, i)
        arr.push $dom
      arr
    ### 判斷本身是否沒任何 html 內容 ###
    $self.ifEmpty = ->
      @html() is ''
    ### 取得包含本身的 html code ###
    $self.getHtml = ->
      div = $('<div/>')
      div.append @clone()
      html = div.html()
      div.remove()
      html
    return

  cb and cb($self)
  $self