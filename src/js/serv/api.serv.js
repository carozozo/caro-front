
/* 自定義 api */
cf.regServ('api', function(cf) {
  var _ajax, self;
  self = {};
  _ajax = cf.ajax;
  self.demoPostApi = function(data) {
    return _ajax.callAjax('DemoPostApi', data);
  };
  self.demoGetApi = function() {
    return _ajax.callAjax('DemoGetApi');
  };
  self.captcha = function() {
    var url;
    url = cf.indexUrl + 'api/Captcha.';
    url += cf.isLocal ? 'png' : 'ashx';

    /* 尾數加上日期, 強制更新 */
    return url + '?v=' + new Date().getTime();
  };
  return self;
});

cf.regDocReady(function() {

  /*
  設置假的 response for 沒有 api 測試
  {{Api 名稱}} : {{假的 response}}
   */
  cf.ajax.fakeResponse = {
    DemoPostApi: {
      error_message: null,
      responseObject: {}
    },
    DemoGetApi: {
      error_message: null,
      responseObject: {}
    }
  };
});
