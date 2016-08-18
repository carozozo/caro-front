
/*
自動化日期下拉選單, 日期下拉選單的值會依照所選的年和月改變
e.g. 閏年的2月, 日期範圍會是 1~29 而不是 1~28
 */
cf.regModule('cfDateDropdown', function(triggerName, opt) {
  var $day, $month, $self, $year, _triggerName, daysInMonth, endYear, onSetDay, onSetMonth, onSetYear, setMonthOpt, setYearOpt, startYear, updateNumberOfDays;
  if (opt == null) {
    opt = {};
  }

  /*
  triggerName: 指定 年和月在 on change 的 namespace, 避免多重觸發
   */
  $self = this;

  /* 年份 <select> 容器 */
  $year = opt.$year ? opt.$year : $('<select/>').appendTo($self);

  /* 月份 <select> 容器 */
  $month = opt.$month ? opt.$month : $('<select/>').appendTo($self);

  /* 日期 <select> 容器 */
  $day = opt.$day ? opt.$day : $('<select/>').appendTo($self);

  /* 起始年份 */
  startYear = opt.startYear || (new Date).getFullYear();

  /* 結束年份 */
  endYear = opt.endYear || startYear - 110;

  /* 設置每個 year 的 options 時觸發的 cb */
  onSetYear = opt.onSetYear;

  /* 設置每個 month 的 options 時觸發的 cb */
  onSetMonth = opt.onSetMonth;

  /* 設置每個 day 的 options 時觸發的 cb */
  onSetDay = opt.onSetDay;
  _triggerName = 'change.cfDateDropdown.' + triggerName;
  daysInMonth = function(year, month) {
    return new Date(year, month, 0).getDate();
  };
  setYearOpt = function() {
    var i, j, ref, ref1;
    $year.html('').append($('<option />').val('').html('年'));
    for (i = j = ref = startYear, ref1 = endYear; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
      if (onSetYear) {
        if (onSetYear(i) === false) {
          break;
        }
        if (onSetYear(i) === true) {
          continue;
        }
      }
      $year.append($('<option />').val(i).html(i));
    }
  };
  setMonthOpt = function() {
    var i, j;
    $month.html('').append($('<option />').val('').html('月'));
    for (i = j = 1; j <= 12; i = ++j) {
      if (onSetMonth) {
        if (onSetMonth(i) === false) {
          break;
        }
        if (onSetMonth(i) === true) {
          continue;
        }
      }
      $month.append($('<option />').val(i).html(i));
    }
  };
  updateNumberOfDays = function() {
    var days, i, j, month, ref, year;
    $day.html('').append($('<option />').val('').html('日'));
    month = $month.val();
    year = $year.val();
    if (!year || !month) {
      return;
    }
    days = daysInMonth(year, month);
    for (i = j = 1, ref = days; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      if (onSetDay) {
        if (onSetDay(i) === false) {
          break;
        }
        if (onSetDay(i) === true) {
          continue;
        }
      }
      $day.append($('<option />').val(i).html(i));
    }
  };
  setYearOpt();
  setMonthOpt();
  updateNumberOfDays();
  $year.off(_triggerName).on(_triggerName, function() {
    updateNumberOfDays();
  });
  $month.off(_triggerName).on(_triggerName, function() {
    updateNumberOfDays();
  });

  /* 取得下拉選單的日期 */
  $self.getDate = function(separator) {
    var day, month, year;
    if (separator == null) {
      separator = '/';
    }
    year = $year.val();
    month = $month.val();
    day = $day.val();
    if (!(year && month && day)) {
      return null;
    }
    return year + separator + month + separator + day;
  };

  /* 設置下拉選單選取的日期 */
  $self.setDate = function(year, month, day) {
    if (year || year === '') {
      $year.val(year);
    }
    if (month || month === '') {
      $month.val(month);
    }
    updateNumberOfDays();
    if (day || day === '') {
      $day.val(day);
    }
    return $self;
  };

  /* disable 下拉選單 */
  $self.disableAll = function() {
    $year.prop('disabled', true);
    $month.prop('disabled', true);
    $day.prop('disabled', true);
    return $self;
  };

  /* enable 下拉選單 */
  $self.enableAll = function() {
    $year.prop('disabled', false);
    $month.prop('disabled', false);
    $day.prop('disabled', false);
    return $self;
  };
  $self.$year = $year;
  $self.$month = $month;
  $self.$day = $day;
  return $self;
});
