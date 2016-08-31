cf.router.regPage('module/cfListDom', function() {
  var $page, $tr, cleanList, list;
  $page = this;
  $tr = $page.dom('.listTr');
  list = [
    {
      name: 'caro1',
      age: 1
    }, {
      name: 'caro2',
      age: 2
    }, {
      name: 'caro3',
      age: 3
    }
  ];
  cleanList = function() {
    $tr.nextAll().remove();
    $tr.prevAll().remove();
  };
  $page.dom('#setList1Btn').onClick(function() {
    cleanList();
    $tr.cfListDom(caro.clone(list));
  });
  $page.dom('#setList2Btn').onClick(function() {
    cleanList();
    $tr.cfListDom(caro.cloneDeep(list), {
      isAfter: false
    });
  });
  $page.dom('#setList3Btn').onClick(function() {
    cleanList();
    $tr.cfListDom(caro.cloneDeep(list), {
      befInsert: function(data, i, $dom) {
        if (i === 1) {
          return true;
        }
        $dom.css({
          color: '#00f'
        });
        data.name = '姓名: ' + data.name;
        data.age = '年齡: ' + data.age;
      },
      aftInsert: function(data, i, $dom) {
        $dom.hide().fadeIn();
      }
    });
  });
  return $page;
});
