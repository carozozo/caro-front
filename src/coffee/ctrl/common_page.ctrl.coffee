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
    $codeTargetArr.push($($codeTarget).caroModal())
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

  $self

cf.router.regAftPage ->
  cf.router.$page.commonPage()
  return