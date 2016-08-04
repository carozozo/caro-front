
/* 自定義 api */
cf.regServ('api', function(cf) {
  var _ajax, _cfg, _indexUrl, _isTest, generateApiUrl, self;
  self = {};
  _cfg = cf.config('ajax');
  _isTest = cf.isLocal || _cfg.isTestMode;
  _ajax = cf.ajax;
  _indexUrl = cf.indexUrl;
  generateApiUrl = function(apiName) {
    var apiUrl;
    apiUrl = _indexUrl + 'api/';
    apiUrl += apiName + '.ashx';
    return apiUrl;
  };
  self.demoPostApi = function(data) {
    var url;
    url = generateApiUrl('DemoPostApi');
    return _ajax.callAjax(url, data, {
      fakeResponse: {
        error_message: null,
        responseObject: {}
      }
    });
  };
  self.demoGetApi = function() {
    var url;
    url = generateApiUrl('DemoGetApi');
    return _ajax.callAjax(url, null, {
      fakeResponse: {
        error_message: null,
        responseObject: {}
      }
    });
  };
  self.captcha = function() {
    var url;
    url = cf.indexUrl + 'api/Captcha.';
    url += _isTest ? 'png' : 'ashx';

    /* 尾數加上日期, 強制更新 */
    return url + '?v=' + new Date().getTime();
  };
  return self;
});
