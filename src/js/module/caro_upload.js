
/* 檔案上傳 */
cf.regModule('caroUpload', function(url, opt) {
  var $, $form, $inputFile, $self, _befUploadCb, _errCb, _files, _formName, _iframeName, _inputFileName, _isBefIe9, _moduleIndex, _selectCb, _sucCb, accept, cf, fileType, multiple;
  if (opt == null) {
    opt = {};
  }
  $self = this;
  cf = $self.cf;
  $ = cf.require('$');
  _isBefIe9 = cf.isBefIe9;
  _moduleIndex = cf.data('caroUploadIndex') || 1;
  _files = [];
  _selectCb = null;
  _befUploadCb = null;
  _sucCb = null;
  _errCb = null;
  _inputFileName = opt.inputFileName || 'caroUploadInputFile' + _moduleIndex;
  _formName = 'caroUploadForm' + _moduleIndex;
  _iframeName = 'caroUploadIframe' + _moduleIndex;
  opt = opt || {};
  fileType = opt.fileType;
  multiple = caro.isBoolean(opt.multiple) ? opt.multiple : true;
  accept = (function() {
    var ret;
    ret = '';

    /* 未來陸續增加 */
    switch (fileType) {
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
    $dom = $('<input type="file"/>').attr('name', _inputFileName).attr('id', _inputFileName).prop('multiple', multiple).css({
      width: '100%'
    }).on('change', function(eve) {

      /* 清空先前選取的檔案 */
      var files;
      caro.cleanArr(_files);
      files = eve.target.files;
      caro.forEach(files, function(file) {
        return _files.push(file);
      });
      return _selectCb && _selectCb({
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
  $self.selectFile = function() {
    if (_isBefIe9) {
      return $self;
    }
    $inputFile.click();
    return $self;
  };
  $self.upload = function() {
    var $iframe, formData;
    if (_isBefIe9) {
      $iframe = $('<iframe/>').attr('name', _iframeName).hide().on('load', function() {
        var res;
        res = $iframe.contents().find('*').first().text();
        if (typeof res === 'string') {
          res = JSON.parse(res);
        }
        _sucCb && _sucCb(res);
        return $iframe.remove();
      });
      $form.attr('action', url).attr('method', 'POST').attr('enctype', 'multipart/form-data').attr('encoding', 'multipart/form-data').attr('target', _iframeName);
      $self.before($iframe);
      $form.submit();
      return;
    }
    formData = new FormData();
    if (_befUploadCb) {
      _befUploadCb(formData, _files);
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
        _sucCb && _sucCb(res);
      },
      error: function(err) {
        _errCb && _errCb(err);
      }
    });
    return $self;
  };
  $self.onSelected = function(cb) {
    _selectCb = cb;
    return $self;
  };
  $self.onBefUpload = function(cb) {
    _befUploadCb = cb;
    return $self;
  };
  $self.suc = function(cb) {
    _sucCb = cb;
    return $self;
  };
  $self.err = function(cb) {
    _errCb = cb;
    return $self;
  };
  cf.data('caroUploadIndex', ++_moduleIndex);
  return $self;
});
