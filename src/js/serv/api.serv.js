
/* 自定義 api */
cf.regServ('api', function(cf) {
  var _ajax, _cfg, _isTest, self;
  self = {};
  _cfg = cf.config('ajax');
  _isTest = cf.isLocal || _cfg.isTestMode;
  _ajax = cf.ajax;
  self.demoPostApi = function(data) {
    return _ajax.callAjax('DemoPostApi', data, {
      fakeResponse: {
        error_message: null,
        responseObject: {}
      }
    });
  };
  self.demoGetApi = function() {
    return _ajax.callAjax('DemoGetApi', null, {
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
