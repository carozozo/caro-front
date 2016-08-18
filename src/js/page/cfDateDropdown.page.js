cf.router.regPage('module/cfDateDropdown', function(cf, $page) {
  $page.dom('.dateDropdown').eachDom(function($dateDropdown, i) {
    var nameSpace;
    nameSpace = 'date' + i;
    switch (i) {
      case 0:
        $dateDropdown.cfDateDropdown(nameSpace);
        $page.dom('#getDateBtn').onClick(function() {
          cf.alert($dateDropdown.getDate());
        });
        $page.dom('#setDateBtn').onClick(function() {
          $dateDropdown.setDate(2015, 12, 21);
        });
        $page.dom('#disableAllBtn').onClick(function() {
          $dateDropdown.disableAll();
        });
        $page.dom('#enableAllBtn').onClick(function() {
          $dateDropdown.enableAll();
        });
        break;
      case 1:
        $dateDropdown.cfDateDropdown(nameSpace, {
          $year: $dateDropdown.find('.year'),
          $month: $dateDropdown.dom('.month'),
          $day: $dateDropdown.dom('.day')
        });
        break;
      case 2:
        $dateDropdown.cfDateDropdown(nameSpace, {
          startYear: 1999,
          endYear: 2001
        });
        break;
      case 3:
        $dateDropdown.cfDateDropdown(nameSpace, {
          onSetYear: function(i) {
            if (i < 2000) {
              return false;
            }
          },
          onSetMonth: function(i) {
            if (i > 3 && i < 10) {
              return true;
            }
          },
          onSetDay: function(i) {
            if (i > 10) {
              return false;
            }
          }
        });
    }
  });
  return $page;
});
