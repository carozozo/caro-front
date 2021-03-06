module.exports = (function () {
  var config = {};
  // 在 src 底下放圖片的資料夾
  config.imgDir = 'images';

  // 放 hug 的資料夾, 編譯後的 html 會放置在 /src 的相對路徑底下
  config.pugDir = '_pug';
  // 是否使用 pug 編譯 html
  config.isUsePug = true;

  // 放 coffee 的資料夾, 編譯後的 js 會放置在 /src 的相對路徑底下
  config.coffeeDir = '_coffee';
  // 是否使用 coffee 編譯 js
  config.isUseCoffee = true;

  // 放 stylus 的資料夾, 編譯後的 css 會放置在 /src 的相對路徑底下
  config.stylusDir = '_stylus';
  // 是否使用 stylus 編譯 css
  config.isUseStylus = true;

  // 執行 gulp prod / gulp buildProd 後, 壓縮之後的 js 檔名
  config.jsName = 'caro-front';
  // 執行 gulp prod / gulp buildProd 後, 壓縮之後的 css 檔名
  config.cssName = 'caro-front';
  // 執行 gulp prod / gulp buildProd 時, 是否加上 sourcemaps
  config.isUseMaps = false;

  // 要寫入 js/css tag 的檔案
  config.injectFileArr = [
    'index.html'
  ];
  config.injectHeadArr = [
    'plugin/jquery.js',
    'plugin/lodash.core.js',
    'plugin/**/*.*',
    'js/cf.js',
    'js/cf_config.js',
    'js/lib/*.*',
    'js/module/*.*'
  ];
  // 要排除自動掃描並加到 tag 的 js/css 檔案
  config.injectExcludeArr = [
    'css/variable.css'
  ];
  // 是否要執行 inject
  config.isUseInject = true;
  return config;
})();