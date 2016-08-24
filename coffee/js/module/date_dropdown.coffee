###
自動化日期下拉選單, 日期下拉選單的值會依照所選的年和月改變
e.g. 閏年的2月, 日期範圍會是 1~29 而不是 1~28
###
cf.regModule 'cfDateDropdown', (nameSpace, opt = {}) ->
  ###
  triggerName: 指定 年和月在 on change 的 namespace, 避免多重觸發
  ###
  $self = @
  ### 年份 <select> 容器 ###
  $year = if opt.$year then opt.$year else $('<select/>').appendTo($self)
  ### 月份 <select> 容器 ###
  $month = if opt.$month then opt.$month else $('<select/>').appendTo($self)
  ### 日期 <select> 容器 ###
  $day = if opt.$day then opt.$day else $('<select/>').appendTo($self)
  ### 起始年份 ###
  startYear = opt.startYear or (new Date).getFullYear()
  ### 結束年份 ###
  endYear = opt.endYear or startYear - 110
  ### 設置每個 year 的 options 時觸發的 cb ###
  onSetYear = opt.onSetYear
  ### 設置每個 month 的 options 時觸發的 cb ###
  onSetMonth = opt.onSetMonth
  ### 設置每個 day 的 options 時觸發的 cb ###
  onSetDay = opt.onSetDay
  _triggerName = 'change.cfDateDropdown.' + nameSpace

  daysInMonth = (year, month) ->
    new Date(year, month, 0).getDate()

  setYearOpt = ->
    $year.html('').append $('<option />').val('').html('年')
    for i in [startYear..endYear]
      if onSetYear
        cbResult = onSetYear(i)
        break if cbResult is false
        continue if cbResult is true
      $year.append $('<option />').val(i).html(i)
    return

  setMonthOpt = ->
    $month.html('').append $('<option />').val('').html('月')
    for i in [1..12]
      if onSetMonth
        cbResult = onSetMonth(i)
        break if cbResult is false
        continue if cbResult is true
      $month.append $('<option />').val(i).html(i)
    return

  updateNumberOfDays = ->
    $day.html('').append($('<option />').val('').html('日'))
    month = $month.val()
    year = $year.val()
    return if !year or !month
    days = daysInMonth(year, month)
    for i in [1..days]
      if onSetDay
        cbResult = onSetDay(i)
        break if cbResult is false
        continue if cbResult is true
      $day.append $('<option />').val(i).html(i)
    return

  setYearOpt()
  setMonthOpt()
  updateNumberOfDays()

  $year.off(_triggerName).on(_triggerName, ->
    updateNumberOfDays()
    return
  )
  $month.off(_triggerName).on(_triggerName, ->
    updateNumberOfDays()
    return
  )

  ### 取得下拉選單的日期 ###
  $self.getDate = (separator = '/') ->
    year = $year.val()
    month = $month.val()
    day = $day.val()
    return null unless year and month and day
    year + separator + month + separator + day

  ### 設置下拉選單選取的日期 ###
  $self.setDate = (year, month, day) ->
    $year.val(year) if year or year is ''
    $month.val(month) if month or month is ''
    updateNumberOfDays()
    $day.val(day) if day or day is ''
    $self

  ### disable 下拉選單 ###
  $self.disableAll = ->
    $year.prop 'disabled', true
    $month.prop 'disabled', true
    $day.prop 'disabled', true
    $self
  ### enable 下拉選單 ###
  $self.enableAll = ->
    $year.prop 'disabled', false
    $month.prop 'disabled', false
    $day.prop 'disabled', false
    $self

  $self.$year = $year
  $self.$month = $month
  $self.$day = $day

  $self