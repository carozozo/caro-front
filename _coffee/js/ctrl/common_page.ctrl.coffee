### 一般的 ctrl ###
cf.regCtrl 'commonPage', ->
  $self = @
  $ = cf.require('$')
  tl = cf.require('TimelineMax')
  tm = cf.require('TweenMax')

  $mainTitle = $self.dom('.mainTitle', ($mainTitle) ->
    actArr = []
    actArr.push(->
      $mainTitle.cfSplitText(
        charCb: ($char, i) ->
          tm.set($char, perspective: 400)
          tm.from($char, 1,
            opacity: 0
            x: -100
            y: -50
            rotationX: 180
            ease: Back.easeOut
            delay: 1 + i * .05
          )
          return
      )
      return
    )
    actArr.push(->
      $mainTitle.cfSplitText(
        charCb: ($char, i) ->
          tm.set($char, perspective: 400)
          tm.from($char, 1,
            opacity: 0
            y: 50
            rotationX: 180
            ease: Back.easeOut
            delay: 1 + i * .05
          )
          return
      )
      return
    )
    actArr.push(->
      $mainTitle.cfSplitText(
        charCb: ($char, i) ->
          tm.set($char, perspective: 400)
          tm.from($char, .5,
            rotationX: 90
            delay: 1 + i * .05
          )
          return
      )
      return
    )
    cf.randomPick(actArr)()
    return
  )

  $contentArr = $self.dom('.content').coverToArr(($content, i) ->
    $content.isOpen = false
    $content.$title = $title = $content.dom('.title', ($title) ->
      colorIndex = i % 5 + 1
      $title.aClass('title' + colorIndex).onClick(->
        unless $content.isOpen
          $content.isOpen = true
          $subContent.slideDown()
        else
          $content.isOpen = false
          $subContent.slideUp()
        return
      ).on('mouseenter', ->
        tm.to($title, .4,
          scale: 1.02
        )
      ).on('mouseleave', ->
        tm.to($title, .4,
          scale: 1
        )
      )
    )

    $subContent = $title.next('div').addClass('subContent').css(
      position: 'relative'
    ).hide()
    return
  )

  subTitleClassArr = ['subTitle1', 'subTitle2', 'subTitle3', 'subTitle4', 'subTitle5']
  cf.forEach(subTitleClassArr, (className) ->
    $self.dom('.' + className).eachDom(($subTitle) ->
      $span = $('<span>').addClass(className)
      html = $subTitle.html()
      $subTitle.removeClass(className).css(
        'margin-top': 5
      ).html($span.html(html))
      $subTitle.next('div').addClass('subContent')
      return
    )
    return
  )

  $codeTargetArr = $self.dom('.codeTarget').coverToArr(($codeTarget) ->
    $codeTarget.addClass('block1').cfModal()
    return
  )

  $self.dom('.codeLink').eachDom(($link, i) ->
    $span = $('<span>').dom().aClass('link')
    html = $link.html()
    $link.removeClass('link').html($span.html(html))
    $span.onClick(->
      $codeTargetArr[i].showModal()
      return
    )
    return
  )

  tl1 = new tl()
  tl1.from($mainTitle, .7,
    width: '0%'
  )
  .staggerFromTo('.title', .3, {
    opacity: 0
    rotationX: 90
    y: -50
  }, {
    y: 0
    opacity: 1
    rotationX: 0
  }, .2, '-=0.5')
  .add(->
    if cf.router.pageName is 'index'
      $contentArr[0].$title.click()
    else
      cf.forEach($contentArr, ($content) ->
        $content.$title.click()
      )
    return
  )

  $self

cf.router.regAftPage ->
  cf.router.$page.commonPage()
  return