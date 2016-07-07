cf.regModule 'caroDateDropdown', (opt = {}) ->
  # 日期下拉選單
  $self = this
  $year = (opt.$year or $self.dom('[name="year"]')).empty()
  $month = (opt.$month or $self.dom('[name="month"]')).empty()
  $day = (opt.$day or $self.dom('[name="day"]')).empty()
  i = undefined

  daysInMonth = (year, month) ->
    new Date(year, month, 0).getDate()

  updateNumberOfDays = ->
    $day.html ''
    month = $month.val()
    year = $year.val()
    days = daysInMonth(year, month)
    if !year
      $month.prop 'selectedIndex', 0
    i = 1
    while i < days + 1
      $day.append $('<option />').val(i).html(i)
      i++
    $day.prepend $('<option />').val('').html('日')
    return

  i = (new Date).getFullYear()
  while i > 1900
    $year.append $('<option />').val(i).html(i)
    i--
  $year.prepend $('<option />').val('').html('年')
  i = 1
  while i < 13
    $month.append $('<option />').val(i).html(i)
    i++
  $month.prepend $('<option />').val('').html('月')
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
    if !year or !month or !day
      return null
    year + sep + month + sep + day

  $self.setOptions = (yearArr, monthArr, dayArr) ->
    appendOptions = ($dom, valArr) ->
      if valArr.length < 1
        return
      valArr = if !caro.isArray(valArr) then [valArr] else valArr
      $dom.empty()
      caro.forEach valArr, (val) ->
        if !val
          return
        $opt = $('<option />').val(val).html(val)
        $dom.append $opt
        return
      return

    if yearArr
      appendOptions $year, yearArr
    if monthArr
      appendOptions $month, monthArr
    if day
      appendOptions $day, dayArr
    $self

  $self.setDate = (year, month, day) ->
    $year.val(year) if year
    $month.val(month) if month
    $day.val(day) if day
    $self

  $self.$year = $year
  $self.$month = $month
  $self.$day = $day

  $self