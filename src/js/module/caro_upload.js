
/* 檔案上傳 */
cf.regModule('cfUpload', function(url, opt) {
  var $, $form, $inputFile, $self, _befUpload, _err, _fileType, _files, _formName, _iframeName, _inputFileName, _isBefIe9, _moduleIndex, _multiple, _onSelected, _suc, accept, cf;
  if (opt == null) {
    opt = {};
  }
  $self = this;
  cf = $self.cf;
  $ = cf.require('$');
  _isBefIe9 = cf.isBefIe9;
  _moduleIndex = cf.data('cfUploadIndex') || 1;
  _files = [];
  _suc = null;
  _err = null;
  _formName = 'cfUploadForm' + _moduleIndex;
  _iframeName = 'cfUploadIframe' + _moduleIndex;

  /* 上傳欄位的 name */
  _inputFileName = opt.inputFileName || 'cfUploadInputFile' + _moduleIndex;

  /* 指定上傳格式 */
  _fileType = opt.fileType;

  /* 是否可以多重選取 */
  _multiple = caro.isBoolean(opt.multiple) ? opt.multiple : true;

  /* 檔案被選取時的 cb */
  _onSelected = opt.onSelected;

  /* 檔案上傳前的 cb */
  _befUpload = opt.befUpload;

  /* 上傳成功 cb */
  _suc = opt.suc;

  /* 上傳失敗 cb */
  _err = opt.err;
  accept = (function() {
    var ret;
    ret = '';

    /* 未來陸續增加 */
    switch (_fileType) {
      case 'img':
        ret = "image/jpg,image/png,image/jpeg,image/gif";
    }
    return ret;
  })();
  $form = (function() {
    var $dom;
    $dom = $('<form></form>').attr('id', _formName);
    $self.after($dom);
    if (_isBefIe9) {
      $self.hide();
    } else {
      $dom.hide();
    }
    return $dom;
  })();
  $inputFile = (function() {
    var $dom;
    $dom = $('<input type="file"/>').attr('name', _inputFileName).attr('id', _inputFileName).prop('multiple', _multiple).css({
      width: '100%'
    }).on('change', function(eve) {

      /* 清空先前選取的檔案 */
      var files;
      caro.cleanArr(_files);
      files = eve.target.files;
      caro.forEach(files, function(file) {
        return _files.push(file);
      });
      return _onSelected && _onSelected({
        event: eve,
        files: _files
      });
    });
    if (accept) {
      $dom.attr('accept', accept);
    }
    $form.append($dom);
    return $dom;
  })();

  /* 開啟選擇上傳檔案視窗 */
  $self.selectFile = function() {
    if (_isBefIe9) {
      return $self;
    }
    $inputFile.click();
    return $self;
  };

  /* 開始上傳 */
  $self.upload = function() {
    var $iframe, formData;
    if (_isBefIe9) {
      $iframe = $('<iframe/>').attr('name', _iframeName).hide().on('load', function() {
        var res;
        res = $iframe.contents().find('*').first().text();
        if (typeof res === 'string') {
          res = JSON.parse(res);
        }
        _suc && _suc(res);
        return $iframe.remove();
      });
      $form.attr('action', url).attr('method', 'POST').attr('enctype', 'multipart/form-data').attr('encoding', 'multipart/form-data').attr('target', _iframeName);
      $self.before($iframe);
      $form.submit();
      return;
    }
    formData = new FormData();
    if (_befUpload) {
      _befUpload(formData, _files);
    } else {
      caro.forEach(_files, function(val, key) {
        return formData.append(key, val);
      });
    }
    $.ajax({
      url: url,
      type: 'POST',
      data: formData,
      cache: false,
      dataType: 'json',
      processData: false,
      contentType: false,
      success: function(res) {
        _suc && _suc(res);
      },
      error: function(err) {
        _err && _err(err);
      }
    });
    return $self;
  };
  cf.data('cfUploadIndex', ++_moduleIndex);
  return $self;
});
