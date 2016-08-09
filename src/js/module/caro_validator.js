
/* 表單驗證 */
cf.regModule('cfValidator', function(opt) {
  var $, $doms, $self, _errInfo, _validateMap, addToDomMap, caro, cf, coverToDomList, regValidate, requireAll, setErrInfo, setValidateDef, trimDomVal, validateCaptcha, validateEmail, validateMinLength, validateMobile, validateNum, validateRequire, validateRocId;
  if (opt == null) {
    opt = {};
  }
  $self = this;
  cf = $self.cf;
  caro = cf.require('caro');
  $ = cf.require('$');
  requireAll = opt.requireAll;

  /*
   * 儲存驗證項目 {<DOM id>: {$dom:<DOM>, id:<驗證id>, <驗證名稱>:<驗證資訊>}}
   * oValidateItem = {$dom:<目標DOM>, id:<驗證id>, <驗證名稱>:<驗證資訊>}
   * oValidateInfo = <驗證資訊>
   */
  _validateMap = {};

  /* 儲存錯誤項目 {<DOM id>: {<錯誤項目>:<驗證資訊>}} */
  _errInfo = null;
  coverToDomList = function($domOrArr) {
    if (!caro.isArray($domOrArr)) {
      return [$domOrArr];
    } else {
      return $domOrArr;
    }
  };
  addToDomMap = function($dom) {
    var id;
    id = $dom.attr('id') || $dom.attr('name');
    if (!_validateMap[id]) {
      _validateMap[id] = {
        id: id,
        $dom: $dom
      };
    }
    return _validateMap[id];
  };
  setValidateDef = function() {
    return _errInfo = null;
  };
  regValidate = function($dom, infoKey, cb) {
    var $domList;
    $domList = coverToDomList($dom);
    caro.forEach($domList, function($dom) {
      var oValidateItem;
      oValidateItem = addToDomMap($dom);
      oValidateItem[infoKey] = {};
      return cb && cb(oValidateItem[infoKey]);
    });
    return $self;
  };
  setErrInfo = function(oValidateItem, errType) {
    var id;
    id = oValidateItem.id;
    if (!_errInfo) {
      _errInfo = {};
    }
    if (!_errInfo[id]) {
      _errInfo[id] = {};
    }
    return _errInfo[id][errType] = oValidateItem;
  };
  trimDomVal = function($dom) {
    var val;
    val = $dom.val().trim();
    $dom.val(val);
    return val;
  };
  validateRequire = function(oValidateItem) {
    var $dom, val;
    $dom = oValidateItem.$dom;
    if ($dom.attr('type') === 'checkbox' && !$dom.is(':checked')) {
      setErrInfo(oValidateItem, 'require');
      return;
    }
    val = trimDomVal($dom);
    if (!val) {
      return setErrInfo(oValidateItem, 'require');
    }
  };
  validateNum = function(oValidateItem) {
    var $dom, val;
    $dom = oValidateItem.$dom;
    val = trimDomVal($dom);
    if (!$.isNumeric(val)) {
      return setErrInfo(oValidateItem, 'number');
    }
  };
  validateMinLength = function(oValidateItem) {
    var $dom, length, size, val;
    $dom = oValidateItem.$dom;
    length = oValidateItem.minLength.length;
    val = trimDomVal($dom);
    size = caro.size(val);
    if (size < length) {
      return setErrInfo(oValidateItem, 'minLength');
    }
  };
  validateEmail = function(oValidateItem) {
    var $dom, regExp, val;
    $dom = oValidateItem.$dom;
    val = trimDomVal($dom);
    regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regExp.test(val)) {
      return setErrInfo(oValidateItem, 'email');
    }
  };
  validateMobile = function(oValidateItem) {
    var $dom, regExp, val;
    $dom = oValidateItem.$dom;
    val = trimDomVal($dom);
    regExp = /^(09)[0-9]{8}$/;
    if (!regExp.test(val)) {
      return setErrInfo(oValidateItem, 'mobile');
    }
  };
  validateRocId = function(oValidateItem) {
    var $dom, regExp, val;
    $dom = oValidateItem.$dom;
    val = trimDomVal($dom);
    regExp = /^[A-Z][0-9]{9}$/;
    if (!regExp.test(val)) {
      return setErrInfo(oValidateItem, 'rocId');
    }
  };
  validateCaptcha = function(oValidateItem) {
    var $dom, length, regExp, val;
    $dom = oValidateItem.$dom;
    length = oValidateItem.captcha.length;
    val = trimDomVal($dom);
    regExp = new RegExp('^[0-9A-Z]{' + length + '}$');
    if (!regExp.test(val)) {
      return setErrInfo(oValidateItem, 'captcha', true);
    }
  };

  /* 設置檢查必填 */
  $self.setRequire = function($dom) {
    return regValidate($dom, 'require');
  };

  /* 設置檢查數字 */
  $self.setNum = function($dom) {
    return regValidate($dom, 'num');
  };

  /* 設置檢查最小長度 */
  $self.setMinLength = function($dom, length) {
    return regValidate($dom, 'minLength', function(oValidateInfo) {
      return oValidateInfo.length = length;
    });
  };

  /* 設置檢查 email */
  $self.setEmail = function($dom) {
    return regValidate($dom, 'email');
  };

  /* 設置檢查手機 */
  $self.setMobile = function($dom) {
    $dom.attr('maxLength', 10);
    return regValidate($dom, 'mobile');
  };

  /* 設置檢查身分證 */
  $self.setRocId = function($dom) {
    $dom.attr('maxLength', 10);
    return regValidate($dom, 'rocId');
  };

  /* 設置檢查驗證碼 */
  $self.setCaptcha = function($dom, length) {
    if (length == null) {
      length = 4;
    }
    $dom.attr('maxLength', length);
    return regValidate($dom, 'captcha', function(oValidateInfo) {
      return oValidateInfo.length = length;
    });
  };

  /* 開始檢查格式 */
  $self.validate = function() {
    setValidateDef();
    caro.forEach(_validateMap, function(oValidateItem) {
      if (oValidateItem.require) {
        validateRequire(oValidateItem);
      }
      if (oValidateItem.num) {
        validateNum(oValidateItem);
      }
      if (oValidateItem.minLength) {
        validateMinLength(oValidateItem);
      }
      if (oValidateItem.email) {
        validateEmail(oValidateItem);
      }
      if (oValidateItem.mobile) {
        validateMobile(oValidateItem);
      }
      if (oValidateItem.rocId) {
        validateRocId(oValidateItem);
      }
      if (oValidateItem.captcha) {
        return validateCaptcha(oValidateItem);
      }
    });
    return _errInfo;
  };
  if (requireAll) {
    $doms = $self.find('input, select, textarea');
    $doms.each(function(i, $dom) {
      $dom = $($dom);
      return $self.setRequire($dom);
    });
  }
  return $self;
});
