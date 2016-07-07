cf.regModule('caroFormChecker', function() {
  var $self, domMap, getDomByMap, getMsgBodyByMap, validDomObjArr, validEmpty;
  $self = this;
  domMap = [
    {
      name: 'name',
      msgBody: '姓名'
    }, {
      name: 'email',
      msgBody: 'Email'
    }, {
      name: 'mobile',
      msgBody: '手機號碼'
    }, {
      name: 'phone',
      msgBody: '電話號碼'
    }, {
      name: 'addr',
      msgBody: '地址'
    }, {
      name: 'rocId',
      msgBody: '身分證字號'
    }, {
      name: 'year',
      msgBody: '年份'
    }, {
      name: 'month',
      msgBody: '月份'
    }, {
      name: 'day',
      msgBody: '日期'
    }, {
      name: 'captcha',
      msgBody: '驗證碼'
    }
  ];
  validDomObjArr = [
    {
      name: 'email',
      msgBody: 'Email'
    }, {
      name: 'mobile',
      msgBody: '手機號碼'
    }, {
      name: 'rocId',
      msgBody: '身分證字號'
    }, {
      name: 'captcha',
      msgBody: '驗證碼'
    }
  ];
  getDomByMap = function(domObj) {
    return $self[domObj.name];
  };
  getMsgBodyByMap = function(domObj) {
    return domObj.msgBody;
  };
  validEmpty = function(domObj) {
    var $dom, val;
    $dom = getDomByMap(domObj);
    if (!$dom) {
      return true;
    }
    val = $dom.getVal();
    return !caro.isEmptyVal(val);
  };
  $self.validEmail = function() {
    var $email, regExp, val;
    $email = $self['email'];
    if (!$email) {
      return true;
    }
    val = $email.val();
    regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regExp.test(val);
  };
  $self.validMobile = function() {
    var $phone, val;
    $phone = $self['mobile'];
    if (!$phone) {
      return true;
    }
    val = $phone.val();
    return /^(09)[0-9]{8}$/.test(val);
  };
  $self.validRocId = function() {
    var $rocId, val;
    $rocId = $self['rocId'];
    if (!$rocId) {
      return true;
    }
    val = $rocId.getVal();
    return /^[A-Z][0-9]{9}$/.test(val);
  };
  $self.validCaptcha = function() {
    var $captcha, regExp, val;
    $captcha = $self['captcha'];
    if (!$captcha) {
      return true;
    }
    val = $captcha.getVal();
    regExp = new RegExp('^[0-9A-Z]{4}$');
    return regExp.test(val);
  };
  $self.validForm = function() {
    var errMsg;
    errMsg = '';
    caro.forEach(domMap, function(domObj) {
      var $dom, msgBody;
      if (validEmpty(domObj)) {
        return true;
      }
      $dom = getDomByMap(domObj);
      msgBody = getMsgBodyByMap(domObj);
      errMsg = '請輸入' + msgBody;
      $dom.focus();
      return false;
    });
    if (errMsg) {
      cf.alert(errMsg);
      return false;
    }
    caro.forEach(validDomObjArr, function(domObj) {
      var $dom, domName, name;
      domName = domObj.name;
      name = caro.upperFirst(domName);
      if ($self['valid' + name]()) {
        return true;
      }
      $dom = getDomByMap(domObj);
      errMsg = '請輸入正確的' + getMsgBodyByMap(domObj);
      $dom.focus();
      return false;
    });
    if (errMsg) {
      cf.alert(errMsg);
      return false;
    }
    return true;
  };
  caro.forEach(domMap, function(domObj) {
    var domName, fnNameBody;
    domName = domObj.name;
    $self[domName] = null;
    fnNameBody = caro.upperFirst(domName);
    $self['set' + fnNameBody] = function($dom) {
      $dom.getVal = function() {
        var val;
        val = $dom.val().trim();
        if (domName === 'rocId' || domName === 'captcha') {
          return val.toUpperCase();
        }
        return val;
      };
      if (domName === 'mobile' || domName === 'rocId') {
        $dom.attr('maxlength', 10);
      } else if (domName === 'captcha') {
        $dom.attr('maxlength', 4);
      }
      $self[domName] = $dom;
      return $self;
    };
  });
  return $self;
});
