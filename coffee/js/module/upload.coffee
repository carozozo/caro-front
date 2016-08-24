###
檔案上傳
###
cf.regModule 'cfUpload', (url, opt = {}) ->
  $self = @
  cf = $self.cf
  $ = cf.require '$'
  _isBefIe9 = cf.isBefIe9
  _moduleIndex = cf.data('cfUploadIndex') or 1
  _files = [];
  _suc = null;
  _err = null;
  _formName = 'cfUploadForm' + _moduleIndex
  _iframeName = 'cfUploadIframe' + _moduleIndex
  ### 上傳欄位的 name ###
  _inputFileName = opt.inputFileName or 'cfUploadInputFile' + _moduleIndex
  ### 指定上傳格式 ###
  _fileType = opt.fileType
  ### 是否可以多重選取 ###
  _multiple = if caro.isBoolean(opt.multiple) then opt.multiple else true
  ### 檔案被選取時的 cb ###
  _onSelected = opt.onSelected
  ### 檔案上傳前的 cb ###
  _befUpload = opt.befUpload
  ### 上傳成功 cb ###
  _suc = opt.suc
  ### 上傳失敗 cb ###
  _err = opt.err

  accept = do ->
    ret = ''
    ### 未來陸續增加 ###
    switch _fileType
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
    .prop('multiple', _multiple)
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
      _onSelected and _onSelected(
        event: eve
        files: _files
      )
    )
    $dom.attr('accept', accept) if accept
    $form.append($dom)
    $dom

  ### 開啟選擇上傳檔案視窗 ###
  $self.selectFile = ->
    return $self if _isBefIe9
    $inputFile.click()
    $self

  ### 開始上傳 ###
  $self.upload = ->
    if _isBefIe9
      $iframe = $('<iframe/>')
      .attr('name', _iframeName)
      .hide()
      .on('load', ->
        res = $iframe.contents().find('*').first().text()
        res = JSON.parse(res) if typeof res is 'string'
        _suc and _suc(res)
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
    if _befUpload
      _befUpload(formData, _files)
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
        _suc and _suc(res)
        return
      error: (err) ->
        _err and _err(err)
        return
    }
    $self

  cf.data('cfUploadIndex', ++_moduleIndex)
  $self