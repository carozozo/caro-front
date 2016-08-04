cf.router.regPage 'index', (cf, $page) ->
  tm = cf.require('TweenMax')
  tl = cf.require('TimelineMax')
  window = cf.require('window')
  caro = cf.require('caro')
  _tracking = cf.tracking

  $page.dom('.title', ($self) ->
    $self.caroAnimated('bounceInDown')
  )
  $page.dom('.content', ($self) ->
    $self.hide()
    setTimeout(->
      $self.show().caroAnimated('bounceInRight')
      return
    , 1000)
  )

  _tracking.page('index')
  $page