### 表單驗證 ###
cf.regModule 'caroValidator', (opt = {}) ->
  $self = this
  cf = $self.cf
  caro = cf.require('caro')
  $ = cf.require('$')
  requireAll = opt.requireAll
  ###
  # 儲存驗證項目 {<DOM id>: {$dom:<DOM>, id:<驗證id>, <驗證名稱>:<驗證資訊>}}
  # oValidateItem = {$dom:<目標DOM>, id:<驗證id>, <驗證名稱>:<驗證資訊>}
  # oValidateInfo = <驗證資訊>
  ###
  _validateMap = {}
  ### 儲存錯誤項目 {<DOM id>: {<錯誤項目>:<驗證資訊>}} ###
  _errInfo = null

  coverToDomList = ($domOrArr) ->
    $list = $domOrArr
    $list = cf.unit.coverDomList($domOrArr) if !caro.isArray($domOrArr)
    $list

  addToDomMap = ($dom) ->
    id = $dom.attr('id') or $dom.attr('name')
    unless _validateMap[id]
      _validateMap[id] =
        id: id
        $dom: $dom
    return _validateMap[id]

  setValidateDef = ->
    _errInfo = null

  regValidate = ($dom, infoKey, cb) ->
    $domList = coverToDomList($dom)
    caro.forEach($domList, ($dom) ->
      oValidateItem = addToDomMap($dom)
      oValidateItem[infoKey] = {}
      cb and cb(oValidateItem[infoKey])
    )
    $self

  setErrInfo = (oValidateItem, errType) ->
    id = oValidateItem.id
    _errInfo = {} unless _errInfo
    _errInfo[id] = {} unless _errInfo[id]
    _errInfo[id][errType] = oValidateItem

  trimDomVal = ($dom) ->
    val = $dom.val().trim()
    $dom.val(val)
    val

  validateRequire = (oValidateItem) ->
    $dom = oValidateItem.$dom
    if($dom.attr('type') is 'checkbox' and !$dom.is(':checked'))
      setErrInfo(oValidateItem, 'require')
      return
    val = trimDomVal($dom)
    if(!val)
      setErrInfo(oValidateItem, 'require')

  validateNum = (oValidateItem) ->
    $dom = oValidateItem.$dom
    val = trimDomVal($dom)
    setErrInfo(oValidateItem, 'number') if(!$.isNumeric(val))

  validateMinLength = (oValidateItem) ->
    $dom = oValidateItem.$dom
    length = oValidateItem.minLength.length
    val = trimDomVal($dom)
    size = caro.size(val)
    setErrInfo(oValidateItem, 'minLength') if(size < length)

  validateEmail = (oValidateItem) ->
    $dom = oValidateItem.$dom
    val = trimDomVal($dom)
    regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    setErrInfo(oValidateItem, 'email') unless regExp.test(val)

  validateMobile = (oValidateItem) ->
    $dom = oValidateItem.$dom
    val = trimDomVal($dom)
    regExp = /^(09)[0-9]{8}$/
    setErrInfo(oValidateItem, 'mobile') unless regExp.test(val)

  validateRocId = (oValidateItem) ->
    $dom = oValidateItem.$dom
    val = trimDomVal($dom)
    regExp = /^[A-Z][0-9]{9}$/
    setErrInfo(oValidateItem, 'rocId') unless regExp.test(val)

  validateCaptcha = (oValidateItem) ->
    $dom = oValidateItem.$dom
    length = oValidateItem.captcha.length
    val = trimDomVal($dom)
    regExp = new RegExp('^[0-9A-Z]{' + length + '}$')
    setErrInfo(oValidateItem, 'captcha', true) unless regExp.test(val)

  $self.setRequire = ($dom) ->
    regValidate($dom, 'require')

  $self.setNum = ($dom) ->
    regValidate($dom, 'num')

  $self.setMinLength = ($dom, length) ->
    regValidate($dom, 'minLength', (oValidateInfo)->
      oValidateInfo.length = length
    )

  $self.setEmail = ($dom) ->
    regValidate($dom, 'email')

  $self.setMobile = ($dom) ->
    $dom.attr('maxLength', 10);
    regValidate($dom, 'mobile')

  $self.setRocId = ($dom) ->
    $dom.attr('maxLength', 10);
    regValidate($dom, 'rocId')

  $self.setCaptcha = ($dom, length = 4) ->
    $dom.attr('maxLength', length);
    regValidate($dom, 'captcha', (oValidateInfo)->
      oValidateInfo.length = length
    )

  $self.validate = ->
    setValidateDef()
    caro.forEach(_validateMap, (oValidateItem) ->
      validateRequire(oValidateItem) if(oValidateItem.require)
      validateNum(oValidateItem) if(oValidateItem.num)
      validateMinLength(oValidateItem) if(oValidateItem.minLength)
      validateEmail(oValidateItem) if(oValidateItem.email)
      validateMobile(oValidateItem) if(oValidateItem.mobile)
      validateRocId(oValidateItem) if(oValidateItem.rocId)
      validateCaptcha(oValidateItem) if(oValidateItem.captcha)
    )
    _errInfo

  if(requireAll)
    $doms = $self.find('input, select, textarea')
    $self.setRequire($doms)

  $self