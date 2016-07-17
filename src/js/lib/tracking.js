
/* 客製化的 tracking for GA and GTM */
cf.regLib('tracking', function(cf) {

  /* https://analytics.google.com/analytics/web/ */

  /* https://tagmanager.google.com/ */
  var _cfg, _trace, _trackedCategory, _trackedLabel, _trackedPageName, _type, getDataLayer, getGa, self, validateEvent, validatePage, window;
  self = {};
  window = cf.require('window');
  _cfg = cf.config('tracking');
  _type = _cfg.type;
  _trace = cf.genTraceFn('tracking');
  _trace.startTrace();
  _trackedPageName = null;
  _trackedCategory = null;
  _trackedLabel = null;
  getGa = function() {
    var ga;
    ga = cf.require('ga');
    if (!ga) {
      _trace.err('GA not load.');
      return null;
    }
    return ga;
  };
  getDataLayer = function() {
    var dataLayer;
    dataLayer = cf.require('dataLayer');
    if (!dataLayer) {
      _trace.err('GTM not load.');
      return null;
    }
    return dataLayer;
  };

  /* 檢查要發送的 page 之前是否才發送過 */
  validatePage = function(type, pageName) {
    if (pageName === _trackedPageName) {
      _trace.err('Send duplicate', type, 'pageView:', pageName);
      return false;
    }
    _trace('Send', type, 'pageView:', pageName);
    _trackedPageName = pageName;
    return true;
  };

  /* 檢查要發送的 event 之前是否才發送過 */
  validateEvent = function(type, category, label) {
    if (category === _trackedCategory && label === _trackedLabel) {
      _trace.err('Send duplicate', type, 'event, category:', category, ', label:', label);
      return false;
    }
    _trace('Send', type, 'event, category:', category, ', label:', label);
    _trackedCategory = category;
    _trackedLabel = label;
    return true;
  };

  /* 發送 page view */
  self.page = (function() {
    var fn;
    switch (_type) {
      case 1:
        fn = function(pageName) {
          var ga;
          if (!validatePage('GA', pageName)) {
            return;
          }
          ga = getGa();
          if (!ga) {
            return;
          }
          ga('send', 'pageview', pageName);
        };
        break;
      case 2:
        fn = function(pageName) {
          var dataLayer, document;
          if (!validatePage('GTM', pageName)) {
            return;
          }
          document = cf.require('document');
          dataLayer = getDataLayer();
          dataLayer.push({
            'event': 'VirtualPageview',
            'virtualPageURL': pageName.trim(),
            'virtualPageTitle': document.title
          });
        };
        break;
      default:
        fn = function(pageName) {
          return _trace('[No tracking] PageView:', pageName);
        };
    }
    return fn;
  })();

  /* 發送 event */
  self.event = (function() {
    var fn;
    switch (_type) {
      case 1:
        fn = function(category, label) {
          var ga;
          if (!validateEvent('GA', category, label)) {
            return;
          }
          ga = getGa();
          if (!ga) {
            return;
          }
          ga('send', 'event', category, 'click', label);
        };
        break;
      case 2:
        fn = function(category, label) {
          var dataLayer;
          if (!validateEvent('GTM', category, label)) {
            return;
          }
          dataLayer = getDataLayer();
          dataLayer.push({
            'event': 'VirtualSend',
            'virtualCategory': category.trim(),
            'virtualAction': 'click',
            'virtualLabel': label.trim()
          });
        };
        break;
      default:
        fn = function(category, label) {
          return _trace('[No tracking] Event category:', category, ', label:', label);
        };
    }
    return fn;
  })();
  return self;
});

cf.regDocReady(function(cf) {
  var $, _cfg, _sdkFnMap, _tagId, _trace, _type, document, downloadSdkFn, window;
  $ = cf.require('$');
  _cfg = cf.config('tracking');
  _type = _cfg.type;
  _tagId = _cfg.tagId;
  window = cf.require('window');
  document = cf.require('document');
  _trace = cf.genTraceFn('tracking');
  _trace.startTrace();
  _sdkFnMap = {
    1: function() {
      _trace('Start download google analytics, _tagId:', _tagId);
      (function(i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function() {
          (i[r].q = i[r].q || []).push(arguments);
        };
        i[r].l = 1 * new Date;
        a = s.createElement(o);
        m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m);
      })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
      ga('create', _tagId, 'auto');
    },
    2: function() {
      var dataLayer, f, i, j;
      _trace('Start download google tag manager, _tagId:', _tagId);
      dataLayer = window.dataLayer = [];
      i = _tagId;
      dataLayer.push({
        'gtm.start': (new Date).getTime(),
        event: 'gtm.js'
      });
      f = document.getElementsByTagName('script')[0];
      j = document.createElement('script');
      j.async = true;
      j.src = '//www.googletagmanager.com/gtm.js?id=' + i;
      f.parentNode.insertBefore(j, f);
    }
  };
  downloadSdkFn = _sdkFnMap[_type];
  downloadSdkFn && downloadSdkFn();
});
