cf.router.regPage 'module/cfDateDropdown', (cf) ->
  $page = @
  $page.dom('.dateDropdown').eachDom(($dateDropdown, i) ->
    switch i
      when 0
        $dateDropdown.cfDateDropdown()
        $page.dom('#getDateBtn').onClick(->
          alert $dateDropdown.getDate()
          return
        )
        $page.dom('#setDateBtn').onClick(->
          $dateDropdown.setDate(2015, 12, 21)
          return
        )
        $page.dom('#disableAllBtn').onClick(->
          $dateDropdown.disableAll()
          return
        )
        $page.dom('#enableAllBtn').onClick(->
          $dateDropdown.enableAll()
          return
        )
      when 1
        $dateDropdown.cfDateDropdown({
          $year: $dateDropdown.find('.year')
          $month: $dateDropdown.dom('.month')
          $day: $dateDropdown.dom('.day')
        })
      when 2
        $dateDropdown.cfDateDropdown({
          startYear: 1999
          endYear: 2001
        })
      when 3
        $dateDropdown.cfDateDropdown({
          onSetYear: (i) ->
            return false if(i < 2000)
            return
          onSetMonth: (i) ->
            return true if(i > 3 and i < 10)
            return
          onSetDay: (i) ->
            return false if(i > 10)
            return
        })
    return
  )

  $page
