module.exports = (function () {
  var self = {};
  // 要優先自動掃描並加到 html js / css tag 的檔案
  self.headArr = [
    '_compatibility/es5-shim.min.js',
    '_compatibility/es5-sham.min.js',
    '_compatibility/html5.js',
    '_bower/lodash.js',
    '_bower/**/*.*',
    '_plugin/**/*.*',
    'js/_app.js',
    'js/config.js',
    'js/serv/*.*',
    'js/module/*.*',
    'js/ctrl/*.*',
    'js/page/*.*'
  ];
  // 要排除自動掃描到 html js / css tag 的檔案路徑
  self.excludeArr = [
  ];
  return self;
})();