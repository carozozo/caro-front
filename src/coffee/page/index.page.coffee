cf.router.regPage 'index', (cf, $page) ->
  window = cf.require('window')
  caro = cf.require('caro')
  $ = cf.require('$')
  _tracking = cf.tracking

  _tracking.page('index')

  $page.dom('.title').each (i, $title) ->
    $title = $($title).dom()
    $subContents = $title.parent().dom('.subContent')
    $title.onClick ->
      $subContents.fadeToggle()
      return
    return

  $page

cf.regDocReady ->
  $('#headerTitle').dom().onClick ->
    cf.router.goPage('index')
    return
  return