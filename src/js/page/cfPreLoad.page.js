cf.router.regPage('module/cfPreLoad', function() {
  var $page, $percentage, $process, fileArr;
  $page = this;
  fileArr = ['cf_title1.png', 'cf_title2.png', 'cf_title3.png', 'no_such_file.png', 'cf_title4.png', 'cf_title5.png'];
  fileArr = cf.map(fileArr, function(file) {
    return 'images/' + file;
  });
  $percentage = $page.dom('#percentage');
  $process = $page.dom('#process');
  $page.cfPreLoad(fileArr, {
    onLoadStart: function(e) {
      $process.append('start-> ');
    },
    onComplete: function(e) {
      $process.append('complete');
    },
    onError: function(e) {
      $process.append('error: ' + e.item.src + '-> ');
    },
    onProgress: function(e, progress) {
      var percentage;
      percentage = Math.round(progress * 100);
      $percentage.html(percentage);
      $process.append('progress: ' + percentage + '%-> ');
    }
  });
  $page.dom('#startLoadBtn').onClick(function() {
    $process.empty();
    return $page.startLoad();
  });
  return $page;
});
