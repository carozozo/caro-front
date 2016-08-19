module.exports = (function () {
  var config = {};
  // 在 src 底下放圖片的資料夾
  config.imgDir = 'images';
  // 放 hug 的資料夾, 編譯後的 html 會放置在 /src 的相對路徑底下
  config.pugDir = 'pug';
  // 放 coffee 的資料夾, 編譯後的 js 會放置在 /src 的相對路徑底下
  config.coffeeDir = 'coffee';
  // 是否使用 pug 編譯 html
  config.isUsePug = true;
  // 是否使用 coffee 編譯 js
  config.isUseCoffee = true;

  // 執行 gulp prod / gulp buildProd 後, 壓縮之後的 js 檔名
  config.prodJsName = 'caro-front';
  // 執行 gulp prod / gulp buildProd 後, 壓縮之後的 css 檔名
  config.prodCssName = 'caro-front';
  // 要寫入 js/css tag 的檔案
  config.injectFileArr = [
    'index.html'
  ];
  // 要優先自動掃描並加到 tag 的 js/css 檔案, 相容性程式要優先載入 https://github.com/es-shims/es5-shim
  config.injectHeadArr = [
    'compatibility/es5-shim.min.js',
    'compatibility/es5-sham.min.js',
    'compatibility/json3.min.js',
    'compatibility/es6-shim.min.js',
    'compatibility/es6-sham.min.js',
    'compatibility/html5.js',
    'plugin/jquery.js',
    'plugin/lodash.js',
    'plugin/**/*.*',
    'js/_app.js',
    'js/config.js',
    'js/lib/*.*',
    'js/serv/*.*',
    'js/module/*.*',
    'js/ctrl/*.*',
    'js/page/*.*'
  ];
  // 要排除自動掃描並加到 tag 的 js/css 檔案
  config.injectExcludeArr = [
  ];
  return config;
})();