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
  // source 對應
  var sourcemaps = require('gulp-sourcemaps');
  // 檔案最小化
  var uglify = require('gulp-uglify');
  // 監聽檔案
  var watch = require('gulp-watch');
  // 取得 bower 的 main file
  var mainBowerFiles = require('main-bower-files');

  var config = require('./gulpfile_config.js');
  var _imgDir = config.imgDir;
  var _coffeeDir = config.coffeeDir;
  var _jsDir = config.jsDir;
  var _cssDir = config.cssDir;
  var _prodJsName = config.prodJsName;
  var _prodCssName = config.prodCssName;
  var _isMinImg = config.isMinImg;
  var _injectFileArr = config.injectFileArr;
  var _injectHeadArr = config.injectHeadArr;
  var _injectExcludeArr = config.injectExcludeArr;
  // 資料夾相關
  var srcDir = './src';
  var distDir = './dist';
  var srcImgDir = srcDir + _imgDir;
  var srcJsDir = srcDir + _jsDir;
  var srcCoffeeDir = srcDir + _coffeeDir;
  var distJsDir = distDir + _jsDir;
  var distCssDir = distDir + _cssDir;
  // 檔案相關
  var allSrcFiles = srcDir + '/**/*.*';
  var allSrcJsFiles = srcDir + '/**/*.js';
  var allSrcCoffeeFiles = srcCoffeeDir + '/**/*.coffee';
  var allSrcCssFiles = srcDir + '/**/*.css';
  var allOtherSrcFilesArr = [allSrcFiles, '!' + allSrcJsFiles, '!' + allSrcCssFiles,
    '!' + allSrcCoffeeFiles, '!**/.*'];
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

  var compileCoffee = function (coffeeFiles, cb) {
    var coffeePipe = coffee({bare: true}).on('error', function (e) {
      console.error('Got coffee error', e);
      coffeePipe.end();
    });
    gulp.src(coffeeFiles, {base: srcCoffeeDir})
      .pipe(coffeePipe)
      .pipe(gulp.dest(srcJsDir))
      .on('end', function () {
        cb && cb();
      });
  };

  var injectFiles = function () {
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
        gulp.src(file)
          .pipe(doInject(injectHeadArr, 'head'))
          .pipe(doInject(injectOtherArr, 'other'))
          .pipe(doInject([], 'app'))
          .pipe(gulp.dest(outputDir));
        return
      }
      gulp.src(file)
        .pipe(doInject([], 'head'))
        .pipe(doInject([], 'other'))
        .pipe(doInject([distJsDir + '/' + _prodJsName, distCssDir + '/' + _prodCssName], 'app'))
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
      fs.writeFile(srcJsDir + '/img.js', fileJson, function (err) {
        if (err) {
          return console.error(err);
        }
      });
    });
  };

  var buildBower = function () {
    var bowerDir = srcDir + '/_bower';
    del.sync([bowerDir]);
    return gulp.src(mainBowerFiles())
      .pipe(gulp.dest(bowerDir));
  };

  var buildJs = function (isUseMap, cb) {
    var allJsArr = injectHeadArr.concat(allSrcJsFiles).concat('!' + allSrcCssFiles);
    if (isUseMap) {
      return gulp.src(allJsArr)
        .pipe(sourcemaps.init())
        .pipe(concat(_prodJsName))
        .pipe(uglify())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(distJsDir))
        .on('end', function () {
          cb && cb();
        });
    }
    return gulp.src(allJsArr)
      .pipe(concat(_prodJsName))
      .pipe(uglify())
      .pipe(gulp.dest(distJsDir))
      .on('end', function () {
        cb && cb();
      });
  };

  var buildCss = function (isUseMap, cb) {
    var allCssArr = injectHeadArr.concat([allSrcCssFiles]).concat(['!' + allSrcJsFiles]);
    if (isUseMap) {
      return gulp.src(allCssArr)
        .pipe(sourcemaps.init())
        .pipe(cleanCss())
        .pipe(concat(_prodCssName))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(distCssDir))
        .on('end', function () {
          cb && cb();
        });
    }
    return gulp.src(allCssArr)
      .pipe(cleanCss())
      .pipe(concat(_prodCssName))
      .pipe(gulp.dest(distCssDir))
      .on('end', function () {
        cb && cb();
      });
  };

  var buildCoffee = function (cb) {
    compileCoffee(allSrcCoffeeFiles, function () {
      cb && cb();
    });
  };

  var buildDev = function (cb) {
    buildCoffee(function () {
      injectFiles();
      cb && cb();
    });
  };

  var buildProd = function (cb, isUseMap) {
    isDev = false;
    cleanDist();
    if (isUseMap) {
      buildCoffee(function () {
        buildJs(true, function () {
          buildCss(true, function () {
            copyOtherToDist(function () {
              injectFiles();
              cb && cb();
            });
          });
        });
      });
      return;
    }
    buildCoffee(function () {
      buildJs(false, function () {
        buildCss(false, function () {
          copyOtherToDist(function () {
            injectFiles();
            cb && cb();
          });
        });
      });
    });
  };

  gulp.task('buildImg', buildImg);
  gulp.task('buildImgWithMin', function () {
    buildImg(true);
  });
  gulp.task('buildBower', buildBower);
  gulp.task('build', buildDev);
  gulp.task('buildProd', buildProd);
  gulp.task('buildProdWithMap', function () {
    buildProd(null, true);
  });
  gulp.task('default', function () {
    buildDev(function () {
      startHttpServ();
      watch(allSrcCoffeeFiles, function (f) {
        var relative = f.relative;
        // 如果該 coffee 被移除 or 更名, 則移除對應的 js
        if (f.isNull()) {
          del.sync(srcJsDir + '/' + relative.replace('.coffee', '.js'));
        }
        compileCoffee(srcCoffeeDir + '/' + relative, function () {
          injectFiles();
        });
      });
    });
  });
  gulp.task('prod', function () {
    buildProd(function () {
      startHttpServ();
    });
  });

})();