
/* 日期下拉選單 */
cf.regModule('caroDateDropdown', function(opt) {
  var $day, $month, $self, $year, daysInMonth, setMonthOpt, setYearOpt, updateNumberOfDays;
  if (opt == null) {
    opt = {};
  }
  $self = this;
  $year = opt.$year || $self.dom('[name="year"]');
  $month = opt.$month || $self.dom('[name="month"]');
  $day = opt.$day || $self.dom('[name="day"]');
  daysInMonth = function(year, month) {
    return new Date(year, month, 0).getDate();
  };
  setYearOpt = function() {
    var nowYear;
    nowYear = (new Date).getFullYear();
    $year.html('').append($('<option />').val('').html('年'));
    caro.loop(function(i) {
      return $year.append($('<option />').val(i).html(i));
    }, nowYear, nowYear - 110);
  };
  setMonthOpt = function() {
    $month.html('').append($('<option />').val('').html('月'));
    caro.loop(function(i) {
      return $month.append($('<option />').val(i).html(i));
    }, 1, 12);
    console.log(123);
  };
  updateNumberOfDays = function() {
    var days, month, year;
    $day.html('').append($('<option />').val('').html('日'));
    month = $month.val();
    year = $year.val();
    if (!year || !month) {
      return;
    }
    days = daysInMonth(year, month);
    caro.loop(function(i) {
      return $day.append($('<option />').val(i).html(i));
    }, 1, days);
  };
  setYearOpt();
  setMonthOpt();
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
    if (dayArr) {
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
  $self.disableAll = function() {
    $year.disable();
    $month.disable();
    $day.disable();
    return $self;
  };
  $self.$year = $year;
  $self.$month = $month;
  $self.$day = $day;
  return $self;
});
