
/* 客製化的 ajax 程式, 可使用假資料測試以及簡化呼叫方式 */
cf.regLib('ajax', function(cf) {
  var $, $loading, _alert, _cfg, _errMsg, _isTest, _responseErrKey, caro, generateAjaxOpt, hideLoading, self, showLoading;
  self = {};
  $ = cf.require('$');
  caro = cf.require('caro');
  _cfg = cf.config('ajax');
  _responseErrKey = _cfg.responseErrKey;
  _isTest = cf.isLocal || _cfg.isTestMode;
  _errMsg = _cfg.errMsg;
  _alert = cf.alert || cf.require('alert');
  $loading = (function() {
    $loading = $('<div/>').css({
      position: 'fixed',
      top: 0,
      left: 0,
      'background-color': 'rgba(0, 0, 0, 0.6)',
      width: '100%',
      height: '100%',
      'z-index': 9999
    });
    $loading.$msg = $('<div/>').css({
      'font-size': '1.5em',
      'text-align': 'center',
      color: '#fff'
    }).appendTo($loading);
    $loading.msgArr = ['Loading', 'Loading.', 'Loading..', 'Loading...'];
    $loading.count = 0;
    return $loading;
  })();
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
  showLoading = function() {
    $loading.$msg.css({
      'margin-top': cf.$window.height() / 2
    });
    $loading.$msg.html($loading.msgArr[$loading.count]);
    $loading.interval = setInterval(function() {
      $loading.count++;
      if ($loading.count === $loading.msgArr.length) {
        $loading.count = 0;
      }
      $loading.$msg.html($loading.msgArr[$loading.count]);
    }, 500);
    $loading.appendTo(cf.$body).fadeIn();
  };
  hideLoading = function() {
    setTimeout(function() {
      clearInterval($loading.interval);
      return $loading.fadeOut(function() {
        $loading.remove();
      });
    }, 500);
  };

  /* 呼叫 ajax, 測試模式時會調用 opt.fakeResponse */
  self.callAjax = function(url, data, opt) {
    var _errCb, _sucCb, ajaxObj, ajaxOpt;
    if (opt == null) {
      opt = {};
    }

    /* 是否隱藏 loading 畫面 */
    if (!opt.isHideLoading) {
      showLoading();
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
      if (caro.isString(res)) {
        res = JSON.parse(res);
      }

      /* 如果有設置 errorKey, 而且回傳的是物件 */
      if (_responseErrKey && caro.isObject(res)) {
        resErr = res[_responseErrKey];
        if (!resErr) {
          _sucCb && _sucCb(res);
        } else {
          _errCb && _errCb(resErr);
        }
        return;
      }
      _sucCb && _sucCb(res);
    });

    /* 如果呼叫 ajax 發生錯誤, 顯示要 alert 的訊息 */
    ajaxObj.error(function() {
      if (_errMsg) {
        _alert(_errMsg);
      }
    });
    ajaxObj.complete(function() {
      if (!opt.isHideLoading) {
        hideLoading();
      }
    });
    return ajaxObj;
  };
  return self;
});
