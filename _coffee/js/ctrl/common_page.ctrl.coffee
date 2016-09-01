### 一般的 ctrl ###
cf.regCtrl 'commonPage', ->
  $self = @
  cf = $self.cf
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
    caro.randomPick(actArr)()
    $mainTitle.init = ->
      $mainTitle.width('100%')
      return
    return
  )

  subTitleClassArr = ['subTitle1', 'subTitle2', 'subTitle3', 'subTitle4', 'subTitle5']
  caro.forEach(subTitleClassArr, (className) ->
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

  $titles = $self.dom('.title').eachDom(($title, i) ->
    $subContent = $title.next('div').addClass('subContent').css(
      position: 'relative'
    ).hide()
    colorIndex = i % 5 + 1
    $title.aClass('title' + colorIndex).onClick(->
      $subContent.slideToggle()
      return
    )
    $title.isOpen = true
    color = $title.css('color')
    $title.on('mouseover', ->
      tm.to($title, .4,
        x: 10
        color: '#fff'
      )
    ).on('mouseleave', ->
      tm.to($title, .4,
        x: 0
        color: color
      )
    )
    return
  )

  distance = 30
  directionOptArr = [{x: -distance}, {x: distance}, {y: -distance}, {y: distance}]
  directionOpt = caro.randomPick(directionOptArr)
  titleOpt =
    opacity: 0
    rotationX: 90
    transformPerspective: 600
  titleOpt = caro.assign(titleOpt, directionOpt)
  tl1 = new tl()
  tl1.from($mainTitle, .7,
    width: 0
    delay: .5
  ).add($mainTitle.init).staggerFromTo($titles, .3, titleOpt, {
    x: 0
    y: 0
    opacity: 1
    rotationX: 0
  }, .2, '-=0.5', ->
    if cf.router.pageName is 'index'
      $($('.subContent')[0]).slideDown()
    else
      $('.subContent').slideDown()
    return
  )

  $self

cf.router.regAftPage ->
  cf.router.$page.commonPage()
  return