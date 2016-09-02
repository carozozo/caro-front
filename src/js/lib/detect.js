
/*
判斷載具函式庫, 應用於 RWD 及相容性處理
Depend on mobile-detect
 */
cf.regLib('detect', function(cf) {
  var ieVer, self, window;
  window = cf.require('window');
  self = new MobileDetect(window.navigator.userAgent);
  ieVer = self.version('IE');
  self.isPhone = self.phone();
  self.isTablet = self.tablet();
  self.isMobile = self.mobile();
  self.ieVersion = ieVer;
  self.isBefIe8 = ieVer && ieVer < 9;
  self.isBefIe9 = ieVer && ieVer < 10;
  return self;
});
