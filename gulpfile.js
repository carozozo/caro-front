(function () {
  // 建立 server
  var browserSync = require('browser-sync');
  // 函式庫
  var caro = require('caro');
  // 清除檔案
  var del = require('del');
  // task 管理
  var gulp = require('gulp');
  // 整理 css
  var cleanCss = require('gulp-clean-css');
  // 將 coffee 檔轉成 js
  var coffee = require('gulp-coffee');
  // 檔案合併
  var concat = require('gulp-concat');
  // 壓縮圖
  var imagemin = require('gulp-imagemin');
  // 自動加入 html-tag
  var inject = require('gulp-inject');
  // template 引擎, 將 .pug 檔轉成 html
  var pug = require('gulp-pug');
  // 轉換 css 裡面引用的 url
  var rewriteCss = require('gulp-rewrite-css');
  // source 對應
  var sourcemaps = require('gulp-sourcemaps');
  // 將 stylus 檔轉成 css
  var stylus = require('gulp-stylus');
  // 檔案最小化
  var uglify = require('gulp-uglify');
  // 監聽檔案
  var watch = require('gulp-watch');

  var config = require('./gulpfile_config.js');
  var _imgDir = caro.addHead(config.imgDir || '', '/');
  var _pugDir = caro.addHead(config.pugDir || '', './');
  var _isUsePug = config.isUsePug;
  var _coffeeDir = caro.addHead(config.coffeeDir || '', './');
  var _isUseCoffee = config.isUseCoffee;
  var _stylusDir = caro.addHead(config.stylusDir || '', './');
  var _isUseStylus = config.isUseStylus;
  var _jsName = config.jsName || 'caro-front';
  var _cssName = config.cssName || 'caro-front';
  var _isRandomName = config.isRandomName;
  var _isUseMaps = config.isUseMaps;
  var _injectFileArr = config.injectFileArr;
  var _injectHeadArr = config.injectHeadArr;
  var _injectExcludeArr = config.injectExcludeArr;
  var _isUseInject = config.isUseInject;

  if (_isRandomName) {
    var rand = caro.random(3, {upper: false});
    _jsName += '.' + rand;
    _cssName += '.' + rand;
  }
  _jsName = caro.addTail(_jsName, '.js');
  _cssName = caro.addTail(_cssName, '.css');

  /* 資料夾相關 */
  var srcDir = './src';
  var distDir = './dist';
  var srcImgDir = srcDir + _imgDir;
  /* 檔案相關 */
  var allSrcFiles = srcDir + '/**/*.*';
  var allPugFiles = _pugDir + '/**/*.pug';
  var allCoffeeFiles = _coffeeDir + '/**/*.coffee';
  var allStylusFiles = _stylusDir + '/**/*.styl';
  var allSrcJsFiles = srcDir + '/**/*.js';
  var allSrcCssFiles = srcDir + '/**/*.css';
  var allHiddenFiles = '**/.*';
  var allOtherSrcFilesArr = [allSrcFiles, '!' + allSrcJsFiles, '!' + allSrcCssFiles, '!' + allHiddenFiles];
  var injectHeadArr = caro.map(_injectHeadArr, function (path) {
    return srcDir + '/' + path;
  });
  var injectOtherArr = [allSrcJsFiles, allSrcCssFiles].concat((function () {
    var arr = caro.map(injectHeadArr, function (path) {
      return '!' + path;
    });
    var excludeArr = caro.map(_injectExcludeArr, function (path) {
      return '!' + srcDir + '/' + path;
    });
    return arr.concat(excludeArr)
  })());
  // 是否為 dev 模式, false 代表 prod 模式
  var isDev = true;

  // 清除 /dist 資料夾
  var cleanDist = function (cb) {
    del.sync([distDir]);
    cb && cb();
  };
  // /src 底下, 除了 js,css,隱藏檔之外的檔案, 都複製到 /dist
  var copyOtherToDist = function (cb) {
    gulp.src(allOtherSrcFilesArr, {nodir: true})
      .pipe(gulp.dest(distDir))
      .on('end', function () {
        cb && cb();
      });
  };
  // 編譯 pug 檔, 輸出到 html 到 /src 相對路徑底下
  var compilePug = function (pugFiles, cb) {
    if (_isUsePug) {
      var pugPipe = pug({pretty: true}).on('error', function (e) {
        console.error(e.toString());
        pugPipe.end();
      });
      gulp.src(pugFiles, {base: _pugDir})
        .pipe(pugPipe)
        .pipe(gulp.dest(srcDir))
        .on('end', function () {
          cb && cb();
        });
      return;
    }
    cb && cb();
  };
  // 編譯 coffee 檔, 輸出到 js 到 /src 相對路徑底下
  var compileCoffee = function (coffeeFiles, cb) {
    if (_isUseCoffee) {
      var coffeePipe = coffee({bare: true}).on('error', function (e) {
        console.error(e.toString());
        coffeePipe.end();
      });
      gulp.src(coffeeFiles, {base: _coffeeDir})
        .pipe(coffeePipe)
        .pipe(gulp.dest(srcDir))
        .on('end', function () {
          cb && cb();
        });
      return;
    }
    cb && cb();
  };
  // 編譯 styl 檔, 輸出到 css 到 /src 相對路徑底下
  var compileStylus = function (stylusFiles, cb) {
    if (_isUseStylus) {
      var stylusPipe = stylus({bare: true}).on('error', function (e) {
        console.error(e.toString());
        stylusPipe.end();
      });
      gulp.src(stylusFiles, {base: _stylusDir})
        .pipe(stylusPipe)
        .pipe(gulp.dest(srcDir))
        .on('end', function () {
          cb && cb();
        });
      return;
    }
    cb && cb();
  };
  // 寫入 <script>, <link> 到指定的檔案
  var doInject = function (source, name) {
    return inject(gulp.src(source, {read: false}), {
      name: name,
      empty: true,
      relative: true
    })
  };
  // 依照 dev 或 prod 模式執行 inject
  var injectFile = function (fileName, type) {
    if (isDev) {
      var srcFile = srcDir + '/' + fileName;
      if (!type) {
        gulp.src(srcFile, {base: srcDir})
          .pipe(doInject(injectHeadArr, 'headJs'))
          .pipe(doInject(injectOtherArr, 'otherJs'))
          .pipe(doInject(injectHeadArr, 'headCss'))
          .pipe(doInject(injectOtherArr, 'otherCss'))
          .pipe(doInject([], 'app'))
          .pipe(gulp.dest(srcDir));
      } else if (type === 'js') {
        gulp.src(srcFile, {base: srcDir})
          .pipe(doInject(injectHeadArr, 'headJs'))
          .pipe(doInject(injectOtherArr, 'otherJs'))
          .pipe(doInject([], 'app'))
          .pipe(gulp.dest(srcDir));
      }
      if (type === 'css') {
        gulp.src(srcFile, {base: srcDir})
          .pipe(doInject(injectHeadArr, 'headCss'))
          .pipe(doInject(injectOtherArr, 'otherCss'))
          .pipe(doInject([], 'app'))
          .pipe(gulp.dest(srcDir));
      }
      return
    }
    // prod 模式
    var distFile = distDir + '/' + fileName;
    var jsPath = distDir + '/' + _jsName;
    var cssPath = distDir + '/' + _cssName;
    gulp.src(distFile, {base: distDir})
      .pipe(doInject([], 'headJs'))
      .pipe(doInject([], 'headCss'))
      .pipe(doInject([], 'otherJs'))
      .pipe(doInject([], 'otherCss'))
      .pipe(doInject([jsPath, cssPath], 'app'))
      .pipe(gulp.dest(distDir));
  };
  // 對所有要寫入 tag 檔案執行 inject
  var injectFiles = function (type) {
    if (_isUseInject) {
      caro.forEach(_injectFileArr, function (fileName) {
        injectFile(fileName, type);
      });
    }
  };
  // 啟動 http server
  var startHttpServ = function () {
    setTimeout(function () {
      var outputDir = isDev ? srcDir : distDir;
      browserSync.init({
        server: {
          baseDir: outputDir
        }
      });
    }, 1000);
  };
  // 合併 js 檔
  var concatJs = function (cb) {
    var allJsArr = injectHeadArr.concat(allSrcJsFiles).concat('!' + allSrcCssFiles);
    if (_isUseMaps) {
      return gulp.src(allJsArr)
        .pipe(sourcemaps.init())
        .pipe(concat(_jsName))
        .pipe(uglify())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(distDir))
        .on('end', function () {
          cb && cb();
        });
    }
    return gulp.src(allJsArr)
      .pipe(concat(_jsName))
      .pipe(uglify())
      .pipe(gulp.dest(distDir))
      .on('end', function () {
        cb && cb();
      });
  };
  // 合併 css 檔
  var concatCss = function (cb) {
    var allCssArr = injectHeadArr.concat([allSrcCssFiles]).concat(['!' + allSrcJsFiles]);
    if (_isUseMaps) {
      return gulp.src(allCssArr)
        .pipe(sourcemaps.init())
        .pipe(rewriteCss({destination: srcDir}))
        .pipe(cleanCss())
        .pipe(concat(_cssName))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(distDir))
        .on('end', function () {
          cb && cb();
        });
    }
    return gulp.src(allCssArr)
      .pipe(rewriteCss({destination: srcDir}))
      .pipe(cleanCss())
      .pipe(concat(_cssName))
      .pipe(gulp.dest(distDir))
      .on('end', function () {
        cb && cb();
      });
  };
  // 編譯所有的 pug 檔
  var buildPug = function (cb) {
    compilePug(allPugFiles, function () {
      cb && cb();
    });
  };
  // 編譯所有的 coffee 檔
  var buildCoffee = function (cb) {
    compileCoffee(allCoffeeFiles, function () {
      cb && cb();
    });
  };
  // 編譯所有的 stylus 檔
  var buildStylus = function (cb) {
    compileStylus(allStylusFiles, function () {
      cb && cb();
    });
  };
  // 掃描 images 並輸出陣列到 src/img.js
  var processImg = function (useMin) {
    var fs = require('fs');
    var path = require('path');
    if (useMin) {
      // 圖檔壓縮
      gulp.src(srcImgDir + '*.*')
        .pipe(imagemin({
          optimizationLevel: 5
        }))
        .pipe(gulp.dest(srcImgDir));
    }
    fs.readdir(srcImgDir, function (err, files) {
      if (err) {
        return console.err(err);
      }
      var fileArr = [];
      caro.forEach(files, function (file) {
        var extname = path.extname(file);
        if (extname !== '.jpg' && extname !== '.png' && extname !== '.svg') {
          return true;
        }
        fileArr.push(_imgDir + '/' + file);
      });
      var fileJson = JSON.stringify(fileArr);
      fileJson = 'cf.$$imgs = ' + fileJson;
      fs.writeFile(srcDir + '/img.js', fileJson, function (err) {
        if (err) {
          return console.error(err);
        }
      });
    });
  };
  // 執行 dev 模式
  var processDev = function (cb) {
    buildPug(function () {
      buildCoffee(function () {
        buildStylus(function () {
          injectFiles();
          cb && cb();
        });
      });
    });
  };
  // 執行 prod 模式
  var processProd = function (cb) {
    isDev = false;
    cleanDist();
    buildPug(function () {
      buildCoffee(function () {
        buildStylus(function () {
          concatJs(function () {
            concatCss(function () {
              copyOtherToDist(function () {
                injectFiles();
                cb && cb();
              });
            });
          });
        });
      });
    });
  };

  gulp.task('buildImg', processImg);
  gulp.task('buildImgWithMin', function () {
    processImg(true);
  });
  gulp.task('build', processDev);
  gulp.task('buildProd', processProd);
  gulp.task('default', function () {
    processDev(function () {
      startHttpServ();
      if (_isUsePug) {
        watch(allPugFiles, function (f) {
          // 相對路徑
          var relative = f.relative;
          var relativeInSrc = relative.replace('.pug', '.html');
          // 如果該 pug 被移除 or 更名, 則移除對應的 html
          if (f.isNull()) {
            del.sync(srcDir + '/' + relativeInSrc);
          }
          compilePug(_pugDir + '/' + relative, function () {
            if (_injectFileArr.indexOf(relativeInSrc) > -1) {
              injectFile(relativeInSrc);
            }
          });
        });
      }
      if (_isUseCoffee) {
        watch(allCoffeeFiles, function (f) {
          // 相對路徑
          var relative = f.relative;
          var relativeInSrc = relative.replace('.coffee', '.js');
          // 如果該 coffee 被移除 or 更名, 則移除對應的 js
          if (f.isNull()) {
            del.sync(srcDir + '/' + relativeInSrc);
          }
          compileCoffee(_coffeeDir + '/' + relative);
        });
      }
      if (_isUseStylus) {
        watch(allStylusFiles, function (f) {
          var relative = f.relative;
          var relativeInSrc = relative.replace('.styl', '.css');
          // 如果該 stylus 被移除 or 更名, 則移除對應的 css
          if (f.isNull()) {
            del.sync(srcDir + '/' + relativeInSrc);
          }
          compileStylus(_stylusDir + '/' + relative);
        });
      }
      watch(allSrcJsFiles, function () {
        injectFiles('js');
      });
      watch(allSrcCssFiles, function () {
        injectFiles('css');
      });
    });
  });
  gulp.task('prod', function () {
    processProd(function () {
      startHttpServ();
    });
  });
})();