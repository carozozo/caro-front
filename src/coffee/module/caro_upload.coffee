### 檔案上傳 ###
cf.regModule 'caroUpload', (url, opt = {}) ->
  $self = this
  cf = $self.cf
  $ = cf.require '$'
  _isBefIe9 = cf.isBefIe9
  _moduleIndex = cf.data('caroUploadIndex') or 1
  _files = [];
  _selectCb = null;
  _befUploadCb = null;
  _sucCb = null;
  _errCb = null;
  _inputFileName = opt.inputFileName or 'caroUploadInputFile' + _moduleIndex
  _formName = 'caroUploadForm' + _moduleIndex
  _iframeName = 'caroUploadIframe' + _moduleIndex

  opt = opt or {}
  fileType = opt.fileType
  multiple = if caro.isBoolean(opt.multiple) then opt.multiple else true

  accept = do ->
    ret = ''
    ### 未來陸續增加 ###
    switch fileType
      when 'img'
        ret = "image/jpg,image/png,image/jpeg,image/gif"
    return ret
  $form = do ->
    $dom = $('<form></form>')
    .attr('id', _formName)
    $self.after($dom)
    if _isBefIe9
      $self.hide()
    else
      $dom.hide()
    return $dom

  $inputFile = do ->
    $dom = $('<input type="file"/>')
    .attr('name', _inputFileName)
    .attr('id', _inputFileName)
    .prop('multiple', multiple)
    .css(
      width: '100%'
    )
    .on('change', (eve) ->
      ### 清空先前選取的檔案 ###
      caro.cleanArr(_files)
      files = eve.target.files
      caro.forEach(files, (file)->
        _files.push(file)
      )
      _selectCb and _selectCb(
        event: eve
        files: _files
      )
    )
    $dom.attr('accept', accept) if accept
    $form.append($dom)
    $dom

  $self.selectFile = ->
    return $self if _isBefIe9
    $inputFile.click()
    $self

  $self.upload = ->
    if _isBefIe9
      $iframe = $('<iframe/>')
      .attr('name', _iframeName)
      .hide()
      .on('load', ->
        res = $iframe.contents().find('*').first().text()
        res = JSON.parse(res) if typeof res is 'string'
        _sucCb and _sucCb(res)
        $iframe.remove()
      )
      $form
      .attr('action', url)
      .attr('method', 'POST')
      .attr('enctype', 'multipart/form-data')
      .attr('encoding', 'multipart/form-data')
      .attr('target', _iframeName)
      $self.before($iframe)
      $form.submit()
      return
    formData = new FormData();
    if _befUploadCb
      _befUploadCb(formData, _files)
    else
      caro.forEach(_files, (val, key) ->
        formData.append(key, val);
      )
    $.ajax {
      url: url
      type: 'POST'
      data: formData
      cache: false
      dataType: 'json'
      processData: false
      contentType: false
      success: (res) ->
        _sucCb and _sucCb(res)
        return
      error: (err) ->
        _errCb and _errCb(err)
        return
    }
    $self

  $self.onSelected = (cb) ->
    _selectCb = cb
    $self

  $self.onBefUpload = (cb) ->
    _befUploadCb = cb
    $self

  $self.suc = (cb) ->
    _sucCb = cb
    $self

  $self.err = (cb) ->
    _errCb = cb
    $self

  cf.data('caroUploadIndex', ++_moduleIndex)
  $self