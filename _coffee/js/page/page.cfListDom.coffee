cf.router.regPage 'module/cfListDom', ->
  $page = @
  caro = cf.require('caro')
  $tr = $page.dom('.listTr')
  list = [{name: 'caro1', age: 1}, {name: 'caro2', age: 2}, {name: 'caro3', age: 3}]

  cleanList = ->
    $tr.nextAll().remove()
    $tr.prevAll().remove()
    return

  cloneList = (arr) ->
    clonedList = []
    caro.forEach(arr, (val) ->
      clonedList.push(caro.clone(val))
      return
    )
    clonedList

  $page.dom('#setList1Btn').onClick(->
    cleanList()
    $tr.cfListDom(cloneList(list))
    return
  )
  $page.dom('#setList2Btn').onClick(->
    cleanList()
#    $tr.cfListDom(cloneList(list),
#      isAfter: false
#    )
    $tr.cfListDom(list,
      isAfter: false
    )
    return
  )
  $page.dom('#setList3Btn').onClick(->
    cleanList()
    $tr.cfListDom(list,
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
