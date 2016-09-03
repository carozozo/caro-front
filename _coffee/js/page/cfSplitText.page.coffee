cf.router.regPage 'module/cfSplitText', (cf) ->
  $page = @
  tm = cf.require('TweenMax')

  setTextCss = ($text) ->
    $text.css(
      border: 'solid 2px #000'
      padding: 3
      'margin-left': 3
    )
    return

  reverseText = ->
    $demoText.reverse and $demoText.reverse()

  $demoText = $page.dom('#demoText')
  $page.dom('#charBtn').onClick(->
    reverseText()
    $demoText.cfSplitText(
      charCb: ($char) ->
        setTextCss($char)
        return
    )
  )
  $page.dom('#wordBtn').onClick(->
    reverseText()
    $demoText.cfSplitText(
      isToChar: false
      isToWord: true
      wordCb: ($word) ->
        setTextCss($word)
        return
    )
  )
  $page.dom('#charWordBtn').onClick(->
    reverseText()
    $demoText.cfSplitText(
      isToWord: true
      charCb: ($char) ->
        setTextCss($char)
        return
      wordCb: ($word) ->
        setTextCss($word)
        return
    )
  )
  $page.dom('#reverseBtn').onClick(->
    reverseText()
  )

  $page