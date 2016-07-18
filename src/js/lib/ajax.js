
/* 客製化的 ajax 程式, 可使用假資料測試以及簡化呼叫方式 */
cf.regLib('ajax', function(cf) {
  var $, _alert, _cfg, _errMsg, _indexUrl, _isTest, _responseErrKey, caro, generateAjaxOpt, generateApiUrl, self;
  self = {};

  /* 測試用的假 response */
  self.fakeResponse = null;
  $ = cf.require('$');
  caro = cf.require('caro');
  _cfg = cf.config('ajax');
  _responseErrKey = _cfg.responseErrKey;
  _isTest = cf.isLocal || _cfg.isTestMode;
  _errMsg = _cfg.errMsg;
  _indexUrl = cf.indexUrl;
  _alert = cf.alert || cf.require('alert');
  generateApiUrl = function(apiName) {
    var apiUrl;
    apiUrl = _indexUrl + 'api/';
    apiUrl += apiName + '.ashx';
    return apiUrl;
  };
  generateAjaxOpt = function(url, data, extendOpt) {
    var opt;
    opt = {
      url: url,
      type: 'POST',
      dataType: 'json',
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      data: data || {}
    };
    return caro.assign(opt, extendOpt || {});
  };

  /* 呼叫 ajax, 測試模式時會調用 fakeResponse */
  self.callAjax = function(apiName, data, ajaxOpt) {
    var ajaxObj, opt, url;
    ajaxObj = null;
    if (_isTest) {
      ajaxObj = {};
      ajaxObj.suc = ajaxObj.success = function(cb) {
        var fakeRes;
        fakeRes = self.fakeResponse[apiName];
        cb && cb(fakeRes);
        return ajaxObj;
      };

      /* 在測試模式時, error 和 err 不會執行 cb */
      ajaxObj.err = ajaxObj.error = function() {
        return ajaxObj;
      };
      return ajaxObj;
    }
    url = generateApiUrl(apiName);
    opt = generateAjaxOpt(url, data, ajaxOpt);
    ajaxObj = $.ajax(opt);

    /* 成功取得 response, 且裡面沒有 error, 則直接 cb(response) */
    ajaxObj.suc = function(cb) {
      return ajaxObj.success(function(res) {
        var resErr;
        resErr = res[_responseErrKey];
        if (caro.isObject(res) && !resErr) {
          cb && cb(res);
        }
      });
    };
    ajaxObj.err = function(cb) {
      return ajaxObj.success(function(res) {
        var resErr;
        resErr = res[_responseErrKey];
        if (caro.isObject(res) && resErr) {
          cb && cb(resErr);
        }
      });
    };

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
