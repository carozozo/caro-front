### 一般的 ctrl ###
cf.regCtrl 'commonPage', ->
  $self = @
  cf = $self.cf
  $ = cf.require('$')
  tl = cf.require('TimelineMax')

  $mainTitle = $self.dom('.mainTitle')
  $content = $self.dom('.content')

  tl1 = new tl()
  tl1.from($mainTitle, .5,
    opacity: 0
    x: -50
  , '-=0.3').from($mainTitle, .7,
    width: 200
    onComplete: ->
      $mainTitle.css(width: '100%')
      return
  ).from($content, .5,
    opacity: 0
  , '-=0.3')

  titleClassArr = ['title', 'subTitle', 'subTitle2', 'subTitle3']
  caro.forEach(titleClassArr, (className) ->
    $self.find('.' + className).each((i, $class) ->
      $class = $($class)
      $span = $('<span>').addClass(className)
      html = $class.html()
      $class.removeClass(className).html($span.html(html))
    )
  )

  $codeTargetArr = []
  $self.find('.codeTarget').each((i, $codeTarget) ->
    $codeTargetArr.push($($codeTarget).cfModal())
  )
  $self.find('.codeLink').each((i, $link) ->
    $link = $($link)
    $span = $('<span>').addClass('link')
    html = $link.html()
    $link.removeClass('link').html($span.html(html))
    $span.dom().onClick(->
      $codeTargetArr[i].showModal()
    )
  )

  $self.dom('.title').each (i, $title) ->
    $title = $($title).dom()
    $subContents = $title.parents('.content').find('.subContent')
    $title.onClick ->
      $subContents.slideToggle()
      return
    return

  $self

cf.router.regAftPage ->
  cf.router.$page.commonPage()
  return