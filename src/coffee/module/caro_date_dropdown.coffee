### 日期下拉選單 ###
cf.regModule 'caroDateDropdown', (opt = {}) ->
  $self = this
  $year = (opt.$year or $self.dom('[name="year"]'))
  $month = (opt.$month or $self.dom('[name="month"]'))
  $day = (opt.$day or $self.dom('[name="day"]'))

  daysInMonth = (year, month) ->
    new Date(year, month, 0).getDate()

  setYearOpt = ->
    nowYear = (new Date).getFullYear()
    $year.html('').append $('<option />').val('').html('年')
    caro.loop((i) ->
      $year.append $('<option />').val(i).html(i)
    , nowYear, nowYear - 110)
    return

  setMonthOpt = ->
    $month.html('').append $('<option />').val('').html('月')
    caro.loop((i) ->
      $month.append $('<option />').val(i).html(i)
    , 1, 12)
    console.log 123
    return

  updateNumberOfDays = ->
    $day.html('').append($('<option />').val('').html('日'))
    month = $month.val()
    year = $year.val()
    return if !year or !month
    days = daysInMonth(year, month)
    caro.loop((i) ->
      $day.append $('<option />').val(i).html(i)
    , 1, days)
    return

  setYearOpt()
  setMonthOpt()
  updateNumberOfDays()

  $year.on 'change', ->
    updateNumberOfDays()
    return
  $month.on 'change', ->
    updateNumberOfDays()
    return

  $self.getDate = (opt) ->
    opt = opt or {}
    year = $year.val()
    month = $month.val()
    day = $day.val()
    sep = opt.sep or '/'
    return null if !year or !month or !day
    year + sep + month + sep + day

  $self.setOptions = (yearArr, monthArr, dayArr) ->
    appendOptions = ($dom, valArr) ->
      return if valArr.length < 1
      valArr = if !caro.isArray(valArr) then [valArr] else valArr
      $dom.empty()
      caro.forEach valArr, (val) ->
        return unless val
        $opt = $('<option />').val(val).html(val)
        $dom.append $opt
        return
      return

    if yearArr
      appendOptions $year, yearArr
    if monthArr
      appendOptions $month, monthArr
    if dayArr
      appendOptions $day, dayArr
    $self

  $self.setDate = (year, month, day) ->
    $year.val(year) if year
    $month.val(month) if month
    $day.val(day) if day
    $self

  $self.disableAll = ->
    $year.disable()
    $month.disable()
    $day.disable()
    $self

  $self.$year = $year
  $self.$month = $month
  $self.$day = $day

  $self