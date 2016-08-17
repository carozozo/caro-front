cf.router.regPage 'module/cfAddrDropdown', (cf, $page) ->
  window = cf.require('window')

  caro.loop((i) ->
    $city = $page.dom('#city' + i)
    $area = $page.dom('#area' + i)
    switch i
      when 1
        $page.cfAddrDropdown($city, $area)
      when 2
        $page.cfAddrDropdown($city, $area,
          isIncludeIsland: true
        )
      when 3
        $page.cfAddrDropdown($city, $area,
          isWithCode: true
        )
    return
  , 1, 3)


  $page
