### DOM 選取器, 支援一些方便的程式 ###
cf.regLib 'dom', (cf) ->
  self = {}
  caro = cf.require('caro')
  window = cf.require('window')
  $ = cf.require('$')
  _trace = cf.genTraceFn('dom')
  _trace.startTrace()

  ### jQuery.find 進階版, 賦予 self 的所有程式給取得的 DOM ###
  $.fn.dom = (selector, cb) ->
    cb = selector if caro.isFunction(selector)
    if selector
      $dom = @find(selector)
    else
      $dom = @
    if $dom.length < 1
      _trace.err 'Can not find Dom:', selector
      return $dom
    ### 將 self 裡面的程式 assign 給 $dom ###
    $dom = caro.assign($dom, self)
    cb and cb($dom)
    $dom

  ### 屬性相關 ###
  do ->
    ### 設置/取得 id ###
    self.id = (id) ->
      if id isnt undefined
        @attr 'id', id
        return @
      @attr 'id'
    ### 設置/取得 name ###
    self.name = (name) ->
      if name isnt undefined
        @attr 'name', name
        return @
      @attr 'name'
    ### 設置/取得 class ###
    self.aClass = (sClass) ->
      if sClass isnt undefined
        @addClass sClass
        return @
      @attr 'class'
    ### 設置/取得 title ###
    self.title = (title) ->
      if title isnt undefined
        @attr 'title', title
        return @
      @attr 'title'
    ### 設置/取得 type ###
    self.type = (type) ->
      if type isnt undefined
        @attr 'type', type
        return @
      @attr 'type'
    ### 設置/取得 src ###
    self.src = (src) ->
      if src isnt undefined
        @attr 'src', src
        return @
      @attr 'src'
    ### 設置/取得 href ###
    self.href = (href, target) ->
      if href isnt undefined
        @attr 'href', href
        if target isnt undefined
          @attr 'target', target
        return @
      @attr 'href'
    ### 是否為可見 ###
    self.isVisible = ->
      @is ':visible'
    ### 是否為隱藏 ###
    self.isHidden = ->
      !@is(':visible')
    ### 設為 enable ###
    self.enable = ->
      @prop 'disabled', false
      @
    ### 設為 disable ###
    self.disable = ->
      @prop 'disabled', true
      @
    ### 設為 checked ###
    self.setChecked = (bool = false) ->
      @prop 'checked', bool
      @
    ### 是否為 checked ###
    self.isChecked = ->
      @is ':checked'

    return

  ### css 相關 ###
  do ->
    ### 取得 css 設置的 top/left/right/bottom...等距離 ###
    self.getCssDistance = (cssType) ->
      px = @css(cssType)
      parseInt px.replace('px')

    ### 取得 margin-top / margin-bottom / margin-left / margin-right 距離 ###
    self.getMargin = (direction) ->
      marginStr = 'margin-'
      marginStr += direction if direction
      margin = @css(marginStr)
      parseInt margin.replace('px')
    ### 改變 dom 的基準點到自己本身的中心點 ###
    self.marginSelfToCenter = (direction) ->
      width = @width()
      height = @height()
      if direction is 'x'
        @css 'margin-left': -(width / 2)
      else if direction is 'y'
        @css 'margin-top': -(height / 2)
      else
        @css
          'margin-left': -(width / 2)
          'margin-top': -(height / 2)
      @
    ### 設置滑鼠指標 ###
    self.setCursor = (cursor) ->
      cursor = cursor or 'pointer'
      @css cursor: cursor

    return

  ### UI 操作 ###
  do($) ->
    ### 觸發 blur 後, 將裡面的值轉大寫 ###
    self.blurUpperCase = (nameSpace) ->
      triggerName = 'blur'
      triggerName += '.' + nameSpace if nameSpace
      @on(triggerName, ->
        $dom = $(@)
        val = $dom.val().trim().toUpperCase()
        $dom.val(val)
      )
    ### 先 off 然後 on ###
    self.action = (eve, fn) ->
      @off(eve).on(eve, (e) ->
        e.preventDefault()
        e.stopPropagation()
        fn e
      )
    ### on('click') 方便使用版 ###
    self.onClick = (fn, nameSpace) ->
      triggerName = 'click'
      triggerName += '.' + nameSpace if nameSpace
      @setCursor().off(triggerName).on(triggerName, fn)
    ### 整合 mouseenter, mouseleave 方便使用版 ###
    self.onEnterAndLeave = (fn1, fn2, nameSpace) ->
      triggerName1 = 'mouseenter'
      triggerName2 = 'mouseleave'
      if nameSpace
        triggerName1 += '.' + nameSpace
        triggerName2 += '.' + nameSpace
      @on(triggerName1, fn1).on(triggerName2, fn2)
    ### 按下 Enter 鍵後觸發的 trigger ###
    self.onPressEnter = (fn, nameSpace) ->
      triggerName = 'keyup'
      triggerName += '.' + nameSpace if nameSpace
      @on(triggerName, (e) ->
        fn(e) if(e.which is 13)
      )

    return

  ### Unit 相關 ###
  do($) ->
    ### trace 用, 計算本身數量 ###
    self.countSelf = (msg) ->
      msg = msg or ''
      console.log 'Count Dom:', @length, msg
    ### 判斷本身是否沒任何 html 內容 ###
    self.isEmpty = ->
      @html().trim()
    ### 同 .val(), 並自動 trim() ###
    self.getVal = ->
      val = @val() or ''
      val.trim()
    ### 同 .getVal(), 並 uppercase ###
    self.getUpperVal = ->
      @getVal().toUpperCase()
    ### 同 .getVal(), 並 lowercase ###
    self.getLowerVal = ->
      @getVal().toLowerCase()
    ### 取得包含本身的 html code ###
    self.getHtml = ->
      div = $('<div/>')
      div.append @clone()
      html = div.html()
      div.remove()
      html
    ### 取得當前的寬高(在 scale 之後還能正確) ###
    self.getRealSize = ->
      {
      width: @getBoundingClientRect().width
      height: @getBoundingClientRect().height
      }
    return
  self