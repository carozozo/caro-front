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
  // coffeescript
  var coffee = require('gulp-coffee');
  // 檔案合併
  var concat = require('gulp-concat');
  // 在檔案內加入標頭
  var header = require('gulp-header');
  // 壓縮圖
  var imagemin = require('gulp-imagemin');
  // 自動加入 html-tag
  var inject = require('gulp-inject');
  // 檔案重新命名
  var rename = require('gulp-rename');
  // source 對應
  var sourcemaps = require('gulp-sourcemaps');
  // 檔案最小化
  var uglify = require('gulp-uglify');
  // 監聽檔案
  var watch = require('gulp-watch');
  // 取得 bower 的 main file
  var mainBowerFiles = require('main-bower-files');
  // 讓 gulp 可以依序執行 task
  var runSequence = require('run-sequence');

  var config = require('./gulpfile_config.js');
  var pkg = require('./package.json');

  // 資料夾相關
  var srcDir = './src/';
  var distDir = './dist/';
  var distJsDir = distDir + 'js/';
  var distCssDir = distDir + 'css/';

  var bowerFolder ='_bower/';
  var bowerDir = srcDir + bowerFolder;
  var srcImgDir = srcDir + 'images/';
  var srcJsDir = srcDir + 'js/';
  var srcCoffeeDir = srcDir + 'coffee/';
  // 檔名相關
  var mainHtmlFileName = 'main.html';
  var outputMainHtmlFileName = 'index.html';
  var allJsRegexp = '**/*.js';
  var allCoffeeRegexp = '**/*.coffee';
  var allCssRegexp = '**/*.css';
  var appJsFileName = 'app.js';
  var appCssFileName = 'app.css';
  // src 相關
  var srcMainHtmlPath = srcDir + outputMainHtmlFileName;
  var allSrcFiles = srcDir + '**/*.*';
  var allSrcJsFiles = srcDir + allJsRegexp;
  var allSrcCoffeeFiles = srcCoffeeDir + allCoffeeRegexp;
  var allSrcCssFiles = srcDir + allCssRegexp;
  var allSrcHiddenFiles = '**/.*';
  var allOtherSrcFilesArr = [allSrcFiles, '!' + allSrcJsFiles, '!' + allSrcCssFiles,
    '!' + allSrcCoffeeFiles, '!' + allSrcHiddenFiles, '!' + srcMainHtmlPath];
  var srcHeadArr = caro.map(config.headArr, function (path) {
    return srcDir + path;
  });
  var srcExcludeHeadArr = (function () {
    var arr = caro.map(srcHeadArr, function (path) {
      return '!' + path;
    });
    var excludeArr = caro.map(config.excludeArr, function (path) {
      return '!' + srcDir + path;
    });
    return arr.concat(excludeArr)
  })();

  var srcOtherArr = [allSrcFiles].concat(srcExcludeHeadArr);
  // dist 相關
  var distMainHtmlPath = distDir + outputMainHtmlFileName;

  var headerStr = (function () {
    var pkgName = pkg.name;
    var pkgVersion = pkg.version;
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var today = year + '/' + month + '/' + day;
    return '<!-- ' + pkgName + '@' + pkgVersion + ' - ' + today + ' -->\r\n';
  })();
  var isDev = true;

  var compileCoffee = function (coffeeFiles) {
    var coffeePipe = coffee({bare: true}).on('error', function (e) {
      console.error('Got coffee error', e);
      coffeePipe.end();
    });
    gulp.src(coffeeFiles, {base: srcCoffeeDir})
      .pipe(coffeePipe)
      .pipe(gulp.dest(srcJsDir));
  };

  var doInject = function (source, name) {
    return inject(gulp.src(source, {read: false}), {
      name: name,
      empty: true,
      relative: true
    })
  };

  var startHttpServ = function () {
    var outputDir = isDev ? srcDir : distDir;
    browserSync.init({
      server: {
        baseDir: outputDir
      }
    });
  };

  var copyMainHtml = function () {
    var outputDir = isDev ? srcDir : distDir;
    return gulp.src(mainHtmlFileName)
      .pipe(header(headerStr))
      .pipe(rename(outputMainHtmlFileName))
      .pipe(gulp.dest(outputDir));
  };
  gulp.task('copyMainHtml', copyMainHtml);

  var copyOtherToDist = function () {
    return gulp.src(allOtherSrcFilesArr)
      .pipe(gulp.dest(distDir));
  };
  gulp.task('copyOtherToDist', copyOtherToDist);

  var cleanDist = function () {
    del.sync([distDir]);
  };
  gulp.task('cleanDist', cleanDist);

  var needDeleteFile = null;
  var deleteFile = function () {
    if (!needDeleteFile) {
      return;
    }
    var targetFile = needDeleteFile;
    needDeleteFile = null;
    return del.sync(targetFile)
  };
  gulp.task('deleteFile', deleteFile);

  var buildJs = function (isUseMap) {
    var allJsArr = srcHeadArr.concat(allSrcJsFiles).concat('!' + allSrcCssFiles);
    if (isUseMap) {
      return gulp.src(allJsArr)
        .pipe(sourcemaps.init())
        .pipe(concat(appJsFileName))
        .pipe(uglify())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(distJsDir));
    }
    return gulp.src(allJsArr)
      .pipe(concat(appJsFileName))
      .pipe(uglify())
      .pipe(gulp.dest(distJsDir));
  };
  gulp.task('buildJs', function(){
    buildJs();
  });
  gulp.task('buildJsWithMap', function () {
    buildJs(true);
  });

  var buildCss = function (isUseMap) {
    var allCssArr = srcHeadArr.concat(allSrcCssFiles).concat('!' + allSrcJsFiles);
    if (isUseMap) {
      return gulp.src(allCssArr)
        .pipe(sourcemaps.init())
        .pipe(cleanCss())
        .pipe(concat(appCssFileName))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(distCssDir));
    }
    return gulp.src(allCssArr)
      .pipe(cleanCss())
      .pipe(concat(appCssFileName))
      .pipe(gulp.dest(distCssDir));
  };
  gulp.task('buildCss', function(){
    buildCss();
  });
  gulp.task('buildCssWithMap', function () {
    buildCss(true);
  });

  var buildCoffee = function () {
    compileCoffee(allSrcCoffeeFiles);
  };
  gulp.task('buildCoffee', buildCoffee);

  var injectFiles = function () {
    var mainFilePath = isDev ? srcMainHtmlPath : distMainHtmlPath;
    var outputDir = isDev ? srcDir : distDir;
    if (isDev) {
      return gulp.src(mainFilePath)
        .pipe(doInject(srcHeadArr, 'head'))
        .pipe(doInject(srcOtherArr, 'other'))
        .pipe(rename(outputMainHtmlFileName))
        .pipe(gulp.dest(outputDir));
    }
    return gulp.src(mainFilePath)
      .pipe(doInject([distJsDir + appJsFileName, distCssDir + appCssFileName], 'app'))
      .pipe(rename(outputMainHtmlFileName))
      .pipe(gulp.dest(outputDir));
  };
  gulp.task('injectFiles', injectFiles);

  var buildDev = function (cb) {
    runSequence(['buildCoffee', 'copyMainHtml'], 'injectFiles', function () {
      cb && cb();
    });
  };
  gulp.task('build', buildDev);

  var buildProd = function (cb, isUseMap) {
    isDev = false;
    if (isUseMap) {
      runSequence('cleanDist', 'buildCoffee', ['buildJsWithMap', 'buildCssWithMap',
        'copyOtherToDist'], 'copyMainHtml', 'injectFiles', function () {
        cb && cb();
      });
      return;
    }
    runSequence('cleanDist', 'buildCoffee', ['buildJs', 'buildCss',
      'copyOtherToDist'], 'copyMainHtml', 'injectFiles', function () {
      cb && cb();
    });
  };
  gulp.task('buildProd', function(){
    buildProd();
  });
  gulp.task('buildProdWithMap', function(){
    buildProd(null, true);
  });

  var buildImg = function () {
    var fs = require('fs');
    var path = require('path');

    gulp.src(srcImgDir + '*.*')
      .pipe(imagemin({
        optimizationLevel: 5
      }))
      .pipe(gulp.dest(srcImgDir));

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
        fileArr.push('images/' + file);
      });
      var fileJson = JSON.stringify(fileArr);
      fileJson = 'cf.$$imgs = ' + fileJson;
      fs.writeFile(srcJsDir + 'img.js', fileJson, function (err) {
        if (err) {
          return console.log(err);
        }
      });
    });
  };
  gulp.task('img', buildImg);

  var buildBower = function () {
    del.sync([bowerDir]);
    return gulp.src(mainBowerFiles())
      .pipe(gulp.dest(bowerDir));
  };
  gulp.task('buildBower', buildBower);

  var startDev = function () {
    buildDev(function () {
      startHttpServ();
      watch(mainHtmlFileName, function () {
        runSequence('copyMainHtml', 'injectFiles');
      });
      watch(allSrcCoffeeFiles, function (f) {
        var relative = f.relative;
        if (f.isNull()) {
          del.sync(srcJsDir + relative.replace('.coffee', '.js'));
        }
        compileCoffee(srcCoffeeDir + relative);
        setTimeout(function () {
          runSequence('injectFiles');
        }, 1000);
      });
    });
  };
  gulp.task('default', startDev);

  var startProd = function () {
    buildProd(function () {
      startHttpServ();
    });
  };
  gulp.task('prod', function () {
    startProd();
  });

})();