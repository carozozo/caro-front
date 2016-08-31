
/*
客製化的 ajax 程式, 可使用假資料測試以及簡化呼叫方式
 */
cf.regServ('ajax', function(cf) {
  var $, $loading, _cfg, _errMsg, _isTest, caro, generateAjaxOpt, hideLoading, self, showLoading;
  self = {};
  $ = cf.require('$');
  caro = cf.require('caro');
  _cfg = cf.config('ajax');
  _isTest = cf.isLocal || _cfg.isTestMode;
  _errMsg = _cfg.errMsg;
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
    var ajaxOpt, completeCb, errCb, jqxhr;
    if (opt == null) {
      opt = {};
    }
    if (_isTest) {
      jqxhr = {};
      jqxhr.done = jqxhr.success = function(cb) {
        var fakeRes;
        fakeRes = opt.fakeResponse;
        cb && cb(fakeRes);
        return jqxhr;
      };

      /* 在測試模式時, error 和 err 不會執行 cb */
      jqxhr.fail = jqxhr.error = function() {
        return jqxhr;
      };
      return jqxhr;
    }

    /* 是否隱藏 loading 畫面 */
    if (!opt.isHideLoading) {
      showLoading();
    }
    ajaxOpt = generateAjaxOpt(url, data, opt.ajaxOpt);
    errCb = function() {

      /* 如果呼叫 ajax 發生錯誤, 顯示要 alert 的訊息 */
      if (_errMsg) {
        alert(_errMsg);
      }
    };
    completeCb = function() {
      if (!opt.isHideLoading) {
        hideLoading();
      }
    };
    jqxhr = $.ajax(ajaxOpt);

    /* jQuery 3.0 之後使用 done/fail 取代 success/error */
    if (jqxhr.done) {
      jqxhr.fail(errCb).always(completeCb);
    } else {
      jqxhr.error(errCb).complete(completeCb);
    }
    return jqxhr;
  };
  return self;
});
