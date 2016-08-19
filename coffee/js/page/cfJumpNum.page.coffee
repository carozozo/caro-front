cf.router.regPage 'module/cfJumpNum', (cf, $page) ->
  $jumNum = $page.dom('#jumpNum').cfJumpNum()
  $page.dom('#jumpNumBtn').onClick(->
    $jumNum.intervalNum(1920)
    return
  )
  $page.dom('#addNumBtn').onClick(->
    $jumNum.intervalAddNm(2015,
      range: 300
    )
    return
  )

  $page
