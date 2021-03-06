cf.router.regPage('module/cfDateDropdown', function(cf) {
  var $page;
  $page = this;
  $page.dom('.dateDropdown').eachDom(function($dateDropdown, i) {
    switch (i) {
      case 0:
        $dateDropdown.cfDateDropdown();
        $page.dom('#getDateBtn').onClick(function() {
          alert($dateDropdown.getDate());
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
        $dateDropdown.cfDateDropdown({
          $year: $dateDropdown.find('.year'),
          $month: $dateDropdown.dom('.month'),
          $day: $dateDropdown.dom('.day')
        });
        break;
      case 2:
        $dateDropdown.cfDateDropdown({
          startYear: 1999,
          endYear: 2001
        });
        break;
      case 3:
        $dateDropdown.cfDateDropdown({
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
