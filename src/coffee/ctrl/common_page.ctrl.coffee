### 一般的 ctrl ###
cf.regCtrl 'commonPage', ->
  $self = @
  cf = $self.cf
  $ = cf.require('$')
  tl = cf.require('TimelineMax')

  $mainTitle = $self.dom('.mainTitle')

  subTitleClassArr = ['subTitle1', 'subTitle2', 'subTitle3']
  caro.forEach(subTitleClassArr, (className) ->
    $self.dom('.' + className).mapDom(($subTitle) ->
      $span = $('<span>').addClass(className)
      html = $subTitle.html()
      $subTitle.removeClass(className).html($span.html(html))
      $subTitle.next('div').addClass('subContent')
      return
    )
    return
  )

  $codeTargetArr = $self.dom('.codeTarget').mapDom(($codeTarget) ->
    $codeTarget.addClass('block').cfModal()
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

  $title = $self.dom('.title').eachDom (($title, i) ->
    $title.next('div').addClass('subContent')
    $subContents = $title.parents('.content').find('.subContent').hide()
    colorIndex = i % 4 + 1
    $title.aClass('title' + colorIndex).onClick(->
      $subContents.slideToggle()
      return
    )
    return
  )

  tl1 = new tl()
  tl1.from($mainTitle, .7,
    opacity: 0
    x: -50
    width: 0
    onComplete: ->
      $mainTitle.css(width: '100%')
      return
  ).staggerFrom($title, .3,
    y: -20
    opacity: 0
  , .2, '-=0.3', -> $('.subContent').slideDown() unless cf.router.pageName is 'index'
  )

  $self

cf.router.regAftPage ->
  cf.router.$page.commonPage()
  return