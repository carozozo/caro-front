module.exports = (function () {
  var self = {};
  // 放 img 的資料夾
  self.imgDir = '/images';
  // 放 coffee script 的資料夾
  self.coffeeDir = '/coffee';
  // 放 js 的資料夾, coffee script 編譯過後的 js 也會放置於此
  self.jsDir = '/js';
  // 放 css 的資料夾
  self.cssDir = '/css';
  // 執行 gulp prod / gulp buildProd 後, 壓縮之後的 js 檔名
  self.prodJsName = 'app.js';
  // 執行 gulp prod / gulp buildProd 後, 壓縮之後的 css 檔名
  self.prodCssName = 'app.css';
  // 要寫入 js/css tag 的檔案
  self.injectFileArr = [
    'index.html'
  ];
  // 要優先自動掃描並加到 tag 的 js/css 檔案, 相容性程式要優先載入 https://github.com/es-shims/es5-shim
  self.injectHeadArr = [
    '_compatibility/es5-shim.min.js',
    '_compatibility/es5-sham.min.js',
    '_compatibility/json3.min.js',
    '_compatibility/es6-shim.min.js',
    '_compatibility/es6-sham.min.js',
    '_compatibility/html5.js',
    '_plugin/jquery.js',
    '_plugin/lodash.js',
    '_plugin/**/*.*',
    'js/_app.js',
    'js/config.js',
    'js/lib/*.*',
    'js/serv/*.*',
    'js/module/*.*',
    'js/ctrl/*.*',
    'js/page/*.*'
  ];
  // 要排除自動掃描並加到 tag 的 js/css 檔案
  self.injectExcludeArr = [
  ];
  return self;
})();