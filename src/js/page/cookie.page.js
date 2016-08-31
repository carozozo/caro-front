cf.router.regPage('lib/cookie', function(cf, $page) {
  var $getCookieName, $setCookieName, $setCookieVal, window;
  $page = this;
  window = cf.require('window');
  $setCookieName = $page.dom('#setCookieName');
  $setCookieVal = $page.dom('#setCookieVal');
  $page.dom('#setCookieBtn').onClick(function() {
    var cookieName, cookieVal;
    cookieName = $setCookieName.val();
    cookieVal = $setCookieVal.val();
    if (cookieName && cookieVal) {
      cf.cookie.setCookie(cookieName, cookieVal);
      return cf.alert('設置成功');
    }
  });
  $getCookieName = $page.dom('#getCookieName');
  $page.dom('#getCookieBtn').onClick(function() {
    var cookieName, cookieVal;
    cookieName = $getCookieName.val();
    if (cookieName) {
      cookieVal = cf.cookie.getCookie(cookieName);
      return cf.alert(cookieVal);
    }
  });
  return $page;
});
