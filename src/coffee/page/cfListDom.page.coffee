cf.router.regPage 'module/cfListDom', (cf, $page) ->
  $tr = $page.dom('.listTr')
  list = [{name: 'caro1', age: 1}, {name: 'caro2', age: 2}, {name: 'caro3', age: 3}]

  cleanList = ->
    $tr.nextAll().remove()
    $tr.prevAll().remove()
    return

  $page.dom('#setList1Btn').onClick(->
    cleanList()
    $tr.cfListDom(caro.clone(list))
    return
  )
  $page.dom('#setList2Btn').onClick(->
    cleanList()
    $tr.cfListDom(caro.cloneDeep(list),
      isAfter: false
    )
    return
  )
  $page.dom('#setList3Btn').onClick(->
    cleanList()
    $tr.cfListDom(caro.cloneDeep(list),
      befInsert: (data, i, $dom) ->
        return true if i is 1
        $dom.css(color: '#00f')
        data.name = '姓名: ' + data.name
        data.age = '年齡: ' + data.age
        return
      aftInsert: (data, i, $dom) ->
        $dom.hide().fadeIn()
        return
    )
    return
  )

  $page
