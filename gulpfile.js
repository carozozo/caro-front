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
  // coffee script
  var coffee = require('gulp-coffee');
  // 檔案合併
  var concat = require('gulp-concat');
  // 壓縮圖
  var imagemin = require('gulp-imagemin');
  // 自動加入 html-tag
  var inject = require('gulp-inject');
  // template 引擎, 將 .pug 檔轉成 html
  var pug = require('gulp-pug');
  // source 對應
  var sourcemaps = require('gulp-sourcemaps');
  // 檔案最小化
  var uglify = require('gulp-uglify');
  // 監聽檔案
  var watch = require('gulp-watch');

  var config = require('./gulpfile_config.js');
  var _imgDir = caro.addHead(config.imgDir || '', '/');
  var _pugDir = caro.addHead(config.pugDir || '', './');
  var _coffeeDir = caro.addHead(config.coffeeDir || '', './');
  var _isUsePug = config.isUsePug;
  var _isUseCoffee = config.isUseCoffee;
  var _prodJsName = caro.addTail((config.prodJsName || 'caro-front') + '.' + caro.random(3, {upper: false}), '.js');
  var _prodCssName = caro.addTail((config.prodCssName || 'caro-front' ) + '.' + caro.random(3, {upper: false}), '.css');
  var _injectFileArr = config.injectFileArr;
  var _injectHeadArr = config.injectHeadArr;
  var _injectExcludeArr = config.injectExcludeArr;
  // 資料夾相關
  var srcDir = './src';
  var distDir = './dist';
  var srcImgDir = srcDir + _imgDir;
  // 檔案相關
  var allSrcFiles = srcDir + '/**/*.*';
  var allPugFiles = _pugDir + '/**/*.pug';
  var allCoffeeFiles = _coffeeDir + '/**/*.coffee';
  var allSrcJsFiles = srcDir + '/**/*.js';
  var allSrcCssFiles = srcDir + '/**/*.css';
  var allOtherSrcFilesArr = [allSrcFiles, '!' + allSrcJsFiles, '!' + allSrcCssFiles, '!**/.*'];
  var injectHeadArr = caro.map(_injectHeadArr, function (path) {
    return srcDir + '/' + path;
  });
  var injectExcludeArr = (function () {
    var arr = caro.map(injectHeadArr, function (path) {
      return '!' + path;
    });
    var excludeArr = caro.map(_injectExcludeArr, function (path) {
      return '!' + srcDir + '/' + path;
    });
    return arr.concat(excludeArr)
  })();
  var injectOtherArr = [allSrcJsFiles, allSrcCssFiles].concat(injectExcludeArr);
  var isDev = true;

  var cleanDist = function (cb) {
    del.sync([distDir]);
    cb && cb();
  };

  var copyOtherToDist = function (cb) {
    gulp.src(allOtherSrcFilesArr)
      .pipe(gulp.dest(distDir))
      .on('end', function () {
        cb && cb();
      });
  };

  var compilePug = function (pugFiles, cb) {
    if (_isUsePug) {
      gulp.src(pugFiles)
        .pipe(pug({
          pretty: true
        }))
        .pipe(gulp.dest(srcDir))
        .on('end', function () {
          cb && cb();
        });
      return;
    }
    cb && cb();
  };

  var compileCoffee = function (coffeeFiles, cb) {
    if (_isUseCoffee) {
      var coffeePipe = coffee({bare: true}).on('error', function (e) {
        console.error('Got coffee error', e);
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

  var injectFiles = function (type) {
    var doInject = function (source, name) {
      return inject(gulp.src(source, {read: false}), {
        name: name,
        empty: true,
        relative: true
      })
    };
    caro.forEach(_injectFileArr, function (fileName) {
      var outputDir = isDev ? srcDir : distDir;
      var file = outputDir + '/' + fileName;
      if (isDev) {
        if (!type) {
          gulp.src(file)
            .pipe(doInject(injectHeadArr, 'headJs'))
            .pipe(doInject(injectHeadArr, 'headCss'))
            .pipe(doInject(injectOtherArr, 'otherJs'))
            .pipe(doInject(injectOtherArr, 'otherCss'))
            .pipe(doInject([], 'app'))
            .pipe(gulp.dest(outputDir));
        }
        if (type === 'js') {
          gulp.src(file)
            .pipe(doInject(injectHeadArr, 'headJs'))
            .pipe(doInject(injectOtherArr, 'otherJs'))
            .pipe(doInject([], 'app'))
            .pipe(gulp.dest(outputDir));
        }
        if (type === 'css') {
          gulp.src(file)
            .pipe(doInject(injectHeadArr, 'headCss'))
            .pipe(doInject(injectOtherArr, 'otherCss'))
            .pipe(doInject([], 'app'))
            .pipe(gulp.dest(outputDir));
        }
        return
      }
      gulp.src(file)
        .pipe(doInject([], 'headJs'))
        .pipe(doInject([], 'headCss'))
        .pipe(doInject([], 'otherJs'))
        .pipe(doInject([], 'otherCss'))
        .pipe(doInject([distDir + '/' + _prodJsName, distDir + '/' + _prodCssName], 'app'))
        .pipe(gulp.dest(outputDir));
    });
  };

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

  var buildImg = function (useMin) {
    var fs = require('fs');
    var path = require('path');

    if (useMin) {
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

  var concatJs = function (isUseMap, cb) {
    var allJsArr = injectHeadArr.concat(allSrcJsFiles).concat('!' + allSrcCssFiles);
    if (isUseMap) {
      return gulp.src(allJsArr)
        .pipe(sourcemaps.init())
        .pipe(concat(_prodJsName))
        .pipe(uglify())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(distDir))
        .on('end', function () {
          cb && cb();
        });
    }
    return gulp.src(allJsArr)
      .pipe(concat(_prodJsName))
      .pipe(uglify())
      .pipe(gulp.dest(distDir))
      .on('end', function () {
        cb && cb();
      });
  };

  var concatCss = function (isUseMap, cb) {
    var allCssArr = injectHeadArr.concat([allSrcCssFiles]).concat(['!' + allSrcJsFiles]);
    if (isUseMap) {
      return gulp.src(allCssArr)
        .pipe(sourcemaps.init())
        .pipe(cleanCss())
        .pipe(concat(_prodCssName))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(distDir))
        .on('end', function () {
          cb && cb();
        });
    }
    return gulp.src(allCssArr)
      .pipe(cleanCss())
      .pipe(concat(_prodCssName))
      .pipe(gulp.dest(distDir))
      .on('end', function () {
        cb && cb();
      });
  };

  var buildPug = function (cb) {
    compilePug(allPugFiles, function () {
      cb && cb();
    });
  };

  var buildCoffee = function (cb) {
    compileCoffee(allCoffeeFiles, function () {
      cb && cb();
    });
  };

  var buildDev = function (cb) {
    buildPug(function () {
      buildCoffee(function () {
        injectFiles();
        cb && cb();
      });
    });
  };

  var buildProd = function (cb, isUseMap) {
    isDev = false;
    cleanDist();
    if (isUseMap) {
      buildPug(function () {
        buildCoffee(function () {
          concatJs(true, function () {
            concatCss(true, function () {
              copyOtherToDist(function () {
                injectFiles();
                cb && cb();
              });
            });
          });
        });
      });
      return;
    }
    buildPug(function () {
      buildCoffee(function () {
        concatJs(false, function () {
          concatCss(false, function () {
            copyOtherToDist(function () {
              injectFiles();
              cb && cb();
            });
          });
        });
      });
    });
  };

  gulp.task('buildImg', buildImg);
  gulp.task('buildImgWithMin', function () {
    buildImg(true);
  });
  gulp.task('build', buildDev);
  gulp.task('buildProd', buildProd);
  gulp.task('buildProdWithMap', function () {
    buildProd(null, true);
  });
  gulp.task('default', function () {
    buildDev(function () {
      startHttpServ();
      if (_isUsePug) {
        watch(allPugFiles, function (f) {
          var relative = f.relative;
          // 如果該 pug 被移除 or 更名, 則移除對應的 html
          if (f.isNull()) {
            del.sync(srcDir + '/' + relative.replace('.pug', '.html'));
          }
          compilePug(_pugDir + '/' + relative);
        });
      }
      watch(allCoffeeFiles, function (f) {
        var relative = f.relative;
        // 如果該 coffee 被移除 or 更名, 則移除對應的 js
        if (f.isNull()) {
          del.sync(srcDir + '/' + relative.replace('.coffee', '.js'));
        }
        compileCoffee(_coffeeDir + '/' + relative);
      });
      watch(allSrcJsFiles, function () {
        injectFiles('js');
      });
      watch(allSrcCssFiles, function () {
        injectFiles('css');
      });
    });
  });
  gulp.task('prod', function () {
    buildProd(function () {
      startHttpServ();
    });
  });
})();