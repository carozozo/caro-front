### DOM 選取器, 支援一些方便的程式 ###
cf.regServ 'dom', (cf) ->
  self = {}
  caro = cf.require('caro')
  window = cf.require('window')
  $ = cf.require('$')
  _trace = cf.genTraceFn('dom')
  _trace.startTrace()

  $.fn.dom = (selector, cb) ->
    $dom = @find(selector)
    if $dom.length < 1
      _trace.err 'Can not find Dom:', selector
      return $dom
    ### 將 self 裡面的程式 assign 給 $dom ###
    $dom = caro.assign($dom, self)
    cb and cb($dom)
    $dom

  do ->
    ### 屬性相關 ###
    self.id = (id) ->
      if id isnt undefined
        @attr 'id', id
        return @
      @attr 'id'

    self.name = (name) ->
      if name isnt undefined
        @attr 'name', name
        return @
      @attr 'name'

    self.aClass = (sClass) ->
      if sClass isnt undefined
        @addClass sClass
        return @
      @attr 'class'

    self.title = (title) ->
      if title isnt undefined
        @attr 'title', title
        return @
      @attr 'title'

    self.type = (type) ->
      if type isnt undefined
        @attr 'type', type
        return @
      @attr 'type'

    self.src = (src) ->
      if src isnt undefined
        @attr 'src', src
        return @
      @attr 'src'

    self.href = (href, target) ->
      if href isnt undefined
        @attr 'href', href
        if target isnt undefined
          @attr 'target', target
        return @
      @attr 'href'

    self.isVisible = ->
      @is ':visible'

    self.isHidden = ->
      !@is(':visible')

    self.enable = ->
      @prop 'disabled', false
      @

    self.disable = ->
      @prop 'disabled', true
      @

    self.setChecked = (bool) ->
      bool = if bool is true then bool else false
      @prop 'checked', bool
      @

    self.isChecked = ->
      @is ':checked'

    return

  do ->
    ### css 相關 ###
    self.getCssDistance = (cssType) ->
      px = @css(cssType)
      parseInt px.replace('px')

    self.getMargin = (direction) ->
      # 取得 margin-top / margin-bottom / margin-left / margin-right 距離
      marginStr = 'margin-'
      if direction
        marginStr += direction
      margin = @css(marginStr)
      parseInt margin.replace('px')

    self.pointSelfToCenter = (direction) ->
      ### 改變 dom 的基準點到自己本身的中心點 ###
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

    self.setCursor = (cursor) ->
      cursor = cursor or 'pointer'
      @css cursor: cursor

    return

  do($) ->
    ### UI 操作 ###
    self.blurUpperCase = (nameSpace) ->
      triggerName = 'blur'
      triggerName += '.' + nameSpace if nameSpace
      @on(triggerName, ->
        $dom = $(@)
        val = $dom.val().trim().toUpperCase()
        $dom.val(val)
      )

    self.action = (eve, fn) ->
      @off(eve).on(eve, (e) ->
        e.preventDefault()
        e.stopPropagation()
        fn e
      )

    self.onClick = (fn, nameSpace) ->
      triggerName = 'click'
      triggerName += '.' + nameSpace if nameSpace
      @setCursor().on(triggerName, fn)

    self.onEnterAndLeave = (fn1, fn2, nameSpace) ->
      triggerName1 = 'mouseenter'
      triggerName2 = 'mouseleave'
      if nameSpace
        triggerName1 += '.' + nameSpace
        triggerName2 += '.' + nameSpace
      @on(triggerName1, fn1).on(triggerName2, fn2)

    self.onPressEnter = (fn, nameSpace) ->
      triggerName = 'keyup'
      triggerName += '.' + nameSpace if nameSpace
      @on(triggerName, (e) ->
        fn(e) if(e.which is 13)
      )

    return

  do($) ->
    self.countSelf = (msg) ->
      msg = msg or ''
      console.log 'Count Dom:', @length, msg

    self.isEmpty = ->
      !$.trim(@html())

    self.getVal = (opt) ->
      upper = opt.upper
      lower = opt.lower
      val = @val().trim()
      if upper
        val.toUpperCase()
      else if lower
        val.toLowerCase()
      val

    self.getHtml = ->
      ### 取得包含本身的 html code ###
      div = $('<div/>')
      div.append @clone()
      html = div.html()
      div.remove()
      html

    self.getRealSize = ->
      ### 取得當前的寬高(在 scale 之後還能正確) ###
      {
      width: @getBoundingClientRect().width
      height: @getBoundingClientRect().height
      }
    return
  self