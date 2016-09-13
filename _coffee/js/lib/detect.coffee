###
判斷載具函式庫, 應用於 RWD 及相容性處理
Depend on mobile-detect
###
cf.regLib('detect', (cf) ->
  window = cf.require('window')
  self = new MobileDetect(window.navigator.userAgent)
  ieVer = self.version('IE')

  self.isPhone = self.phone()
  self.isTablet = self.tablet()
  self.isMobile = self.mobile()
  self.ieVersion = ieVer
  self.isBefIe8 = ieVer and ieVer < 9
  self.isBefIe9 = ieVer and ieVer < 10
  self
)