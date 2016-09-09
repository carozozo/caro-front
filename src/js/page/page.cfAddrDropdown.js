cf.router.regPage('module/cfAddrDropdown', function() {
  var $page;
  $page = this;
  cf.loop(function(i) {
    var $area, $city;
    $city = $page.dom('#city' + i);
    $area = $page.dom('#area' + i);
    switch (i) {
      case 1:
        $page.cfAddrDropdown($city, $area);
        break;
      case 2:
        $page.cfAddrDropdown($city, $area, {
          isIncludeIsland: true
        });
        break;
      case 3:
        $page.cfAddrDropdown($city, $area, {
          isWithCode: true
        });
    }
  }, 1, 3);
  return $page;
});
