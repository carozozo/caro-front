###
將目標內的文字拆解成 div
###
cf.regModule 'cfSplitText', (opt = {}) ->
  $self = @
  ### 是否拆解每個字元 ###
  _isToChar = if opt.isToChar is false then false else true
  ### 是否以空白字元拆解, 拆解後稱為字組 ###
  _isToWord = opt.isToWord
  ### 放置每個字元之後呼叫的 cb ###
  _charCb = opt.charCb
  ### 放置每個字組之後呼叫的 cb ###
  _wordCb = opt.wordCb

  originText = $self.text()
  ### 取得空白字元的寬度 ###
  $blankSpan = $('<span>&nbsp;</span>')
  $self.append($blankSpan)
  blankWidth = $blankSpan.width()
  $blankSpan.remove()

  splitChar = ($dom) ->
    text = $dom.text()
    $dom.empty()
    cf.forEach(text, (char, i) ->
      css = display: 'inline-block'
      char = '&nbsp;' if char is ' '
      $char = $('<div/>').addClass('cfSplitTextChar').html(char).css(css).appendTo($dom)
      _charCb and _charCb($char, i)
      return
    )
    return

  if _isToWord
    $self.empty()
    wordArr = originText.split(' ')
    cf.forEach(wordArr, (word, i) ->
      css = display: 'inline-block'
      css['margin-left'] = blankWidth if i > 0
      $word = $('<div/>').addClass('cfSplitTextWord').text(word).css(css).appendTo($self)
      splitChar($word) if _isToChar
      _wordCb and _wordCb($word, i)
      return
    )
  else
    splitChar($self, true)

  ### 回復成原本的 text 內容 ###
  $self.reverseText = ->
    $self.text(originText)
    $self

  $self