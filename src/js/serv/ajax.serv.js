
/* 客製化的 ajax 程式, 可使用假資料測試以及簡化呼叫方式 */
cf.regServ('ajax', function(cf) {
  var $, _cfg, _fakeResponse, _isTestMode, _responseErrKey, caro, generateAjaxOpt, generateApiUrl, ifTestMode, self;
  self = {};
  $ = cf.require('$');
  caro = cf.require('caro');
  _cfg = cf.config('ajax');
  _responseErrKey = _cfg.responseErrKey;
  _isTestMode = _cfg.isTestMode;
  _fakeResponse = null;
  ifTestMode = function() {
    return cf.isLocal || _isTestMode;
  };
  generateApiUrl = function(apiName) {
    var apiUrl;
    apiUrl = cf.website.getIndexUrl() + 'api/';
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
  self.setFakeResponse = function(fakeRes) {
    _fakeResponse = fakeRes;
  };
  self.callAjax = function(apiName, data, ajaxOpt) {
    var ajaxObj, opt, url;
    ajaxObj = null;
    if (ifTestMode()) {
      ajaxObj = {};
      ajaxObj.suc = ajaxObj.success = function(cb) {
        var fakeRes;
        fakeRes = _fakeResponse[apiName];
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
    return ajaxObj;
  };
  self.getPage = function(pageName, opt) {

    /* 取得 template 頁面 */
    var ajaxObj;
    pageName = caro.addTail(pageName, '.html');
    opt = opt || {};
    ajaxObj = caro.assign({
      type: 'GET'
    }, opt);
    ajaxObj.url = cf.website.getIndexUrl() + 'template/' + pageName;
    return $.ajax(ajaxObj);
  };
  return self;
});
