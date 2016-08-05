
/* 客製化的 ajax 程式, 可使用假資料測試以及簡化呼叫方式 */
cf.regLib('ajax', function(cf) {
  var $, _alert, _cfg, _errMsg, _isTest, _responseErrKey, caro, generateAjaxOpt, self;
  self = {};
  $ = cf.require('$');
  caro = cf.require('caro');
  _cfg = cf.config('ajax');
  _responseErrKey = _cfg.responseErrKey;
  _isTest = cf.isLocal || _cfg.isTestMode;
  _errMsg = _cfg.errMsg;
  _alert = cf.alert || cf.require('alert');
  generateAjaxOpt = function(url, data, extendOpt) {
    var opt;
    opt = {
      url: url,
      type: 'GET'
    };
    if (data) {
      opt.type = 'POST';
      opt.data = data;
    }
    return caro.assign(opt, extendOpt || {});
  };

  /* 呼叫 ajax, 測試模式時會調用 opt.fakeResponse */
  self.callAjax = function(url, data, opt) {
    var _errCb, _sucCb, ajaxObj, ajaxOpt;
    if (opt == null) {
      opt = {};
    }
    if (_isTest) {
      ajaxObj = {};
      ajaxObj.suc = ajaxObj.success = function(cb) {
        var fakeRes;
        fakeRes = opt.fakeResponse;
        cb && cb(fakeRes);
        return ajaxObj;
      };

      /* 在測試模式時, error 和 err 不會執行 cb */
      ajaxObj.err = ajaxObj.error = function() {
        return ajaxObj;
      };
      return ajaxObj;
    }
    ajaxOpt = generateAjaxOpt(url, data, opt.ajaxOpt);
    ajaxObj = $.ajax(ajaxOpt);
    _sucCb = null;
    _errCb = null;
    ajaxObj.suc = function(cb) {
      _sucCb = cb;
      return ajaxObj;
    };
    ajaxObj.err = function(cb) {
      _errCb = cb;
      return ajaxObj;
    };
    ajaxObj.success(function(res) {
      var resErr;
      if (!(caro.isObject(res) && _responseErrKey)) {
        return;
      }
      resErr = res[_responseErrKey];
      if (!resErr) {
        _sucCb && _sucCb(res);
      } else {
        _errCb && _errCb(resErr);
      }
    });

    /* 如果呼叫 ajax 發生錯誤, 顯示要 alert 的訊息 */
    ajaxObj.error(function() {
      if (_errMsg) {
        _alert(_errMsg);
      }
    });
    return ajaxObj;
  };
  return self;
});
