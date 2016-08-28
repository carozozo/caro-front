### 一般的 ctrl ###
cf.regCtrl 'commonPage', ->
  $self = @
  cf = $self.cf
  $ = cf.require('$')
  tl = cf.require('TimelineMax')

  $mainTitle = $self.dom('.mainTitle')

  subTitleClassArr = ['subTitle1', 'subTitle2', 'subTitle3', 'subTitle4', 'subTitle5']
  caro.forEach(subTitleClassArr, (className) ->
    $self.dom('.' + className).mapDom(($subTitle) ->
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

  $codeTargetArr = $self.dom('.codeTarget').mapDom(($codeTarget) ->
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
    width: 300
    delay: .5
  ).staggerFromTo($titles, .3, titleOpt, {
    x: 0
    y: 0
    opacity: 1
    rotationX: 0
  }, .2, '-=0.5', ->
    $('.subContent').slideDown() unless cf.router.pageName is 'index'
    return
  )

  $self

cf.router.regAftPage ->
  cf.router.$page.commonPage()
  return