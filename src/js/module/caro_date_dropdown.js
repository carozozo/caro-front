cf.regModule('caroDateDropdown', function(opt) {
  var $day, $month, $self, $year, daysInMonth, i, updateNumberOfDays;
  if (opt == null) {
    opt = {};
  }
  $self = this;
  $year = (opt.$year || $self.dom('[name="year"]')).empty();
  $month = (opt.$month || $self.dom('[name="month"]')).empty();
  $day = (opt.$day || $self.dom('[name="day"]')).empty();
  i = void 0;
  daysInMonth = function(year, month) {
    return new Date(year, month, 0).getDate();
  };
  updateNumberOfDays = function() {
    var days, month, year;
    $day.html('');
    month = $month.val();
    year = $year.val();
    days = daysInMonth(year, month);
    if (!year) {
      $month.prop('selectedIndex', 0);
    }
    i = 1;
    while (i < days + 1) {
      $day.append($('<option />').val(i).html(i));
      i++;
    }
    $day.prepend($('<option />').val('').html('日'));
  };
  i = (new Date).getFullYear();
  while (i > 1900) {
    $year.append($('<option />').val(i).html(i));
    i--;
  }
  $year.prepend($('<option />').val('').html('年'));
  i = 1;
  while (i < 13) {
    $month.append($('<option />').val(i).html(i));
    i++;
  }
  $month.prepend($('<option />').val('').html('月'));
  updateNumberOfDays();
  $year.on('change', function() {
    updateNumberOfDays();
  });
  $month.on('change', function() {
    updateNumberOfDays();
  });
  $self.getDate = function(opt) {
    var day, month, sep, year;
    opt = opt || {};
    year = $year.val();
    month = $month.val();
    day = $day.val();
    sep = opt.sep || '/';
    if (!year || !month || !day) {
      return null;
    }
    return year + sep + month + sep + day;
  };
  $self.setOptions = function(yearArr, monthArr, dayArr) {
    var appendOptions;
    appendOptions = function($dom, valArr) {
      if (valArr.length < 1) {
        return;
      }
      valArr = !caro.isArray(valArr) ? [valArr] : valArr;
      $dom.empty();
      caro.forEach(valArr, function(val) {
        var $opt;
        if (!val) {
          return;
        }
        $opt = $('<option />').val(val).html(val);
        $dom.append($opt);
      });
    };
    if (yearArr) {
      appendOptions($year, yearArr);
    }
    if (monthArr) {
      appendOptions($month, monthArr);
    }
    if (day) {
      appendOptions($day, dayArr);
    }
    return $self;
  };
  $self.setDate = function(year, month, day) {
    if (year) {
      $year.val(year);
    }
    if (month) {
      $month.val(month);
    }
    if (day) {
      $day.val(day);
    }
    return $self;
  };
  $self.$year = $year;
  $self.$month = $month;
  $self.$day = $day;
  return $self;
});
