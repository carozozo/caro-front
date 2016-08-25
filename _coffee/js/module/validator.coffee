###
表單驗證, 要檢查的欄位需要設置 id 或 name
###
cf.regModule 'cfValidator', (opt = {}) ->
  $self = @
  cf = $self.cf
  caro = cf.require('caro')
  $ = cf.require('$')
  requireAll = opt.requireAll
  ###
  儲存驗證項目 {<DOM id>: oValidateItem}
  oValidateItem = {$dom:<目標DOM>, id:<驗證id>, <驗證名稱>: oValidateInfo}
  oValidateInfo = <驗證資訊>
  ###
  _validateMap = {}
  ### 儲存錯誤項目 {<DOM id>: [<錯誤項目>]} ###
  _errInfo = null

  coverToDomList = ($domOrArr) ->
    if !caro.isArray($domOrArr) then [$domOrArr] else $domOrArr

  addToDomMap = ($dom) ->
    id = $dom.attr('id') or $dom.attr('name')
    unless _validateMap[id]
      _validateMap[id] =
        id: id
        $dom: $dom
    return _validateMap[id]

  setValidateDef = ->
    _errInfo = null

  regValidate = ($dom, validateType, cb) ->
    $domList = coverToDomList($dom)
    caro.forEach($domList, ($dom) ->
      oValidateItem = addToDomMap($dom)
      oValidateItem[validateType] = {}
      cb and cb(oValidateItem[validateType])
    )
    $self

  setErrInfo = (oValidateItem, errType) ->
    id = oValidateItem.id
    _errInfo = {} unless _errInfo
    _errInfo[id] = [] unless _errInfo[id]
    _errInfo[id].push(errType)

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
    setErrInfo(oValidateItem, 'require') if val is ''

  validateNum = (oValidateItem) ->
    $dom = oValidateItem.$dom
    val = trimDomVal($dom)
    setErrInfo(oValidateItem, 'number') if val and !$.isNumeric(val)

  validateMinLength = (oValidateItem) ->
    $dom = oValidateItem.$dom
    length = oValidateItem.minLength.length
    val = trimDomVal($dom)
    size = caro.size(val)
    setErrInfo(oValidateItem, 'minLength') if size and size < length

  validateEmail = (oValidateItem) ->
    $dom = oValidateItem.$dom
    val = trimDomVal($dom)
    regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    setErrInfo(oValidateItem, 'email') if val and !regExp.test(val)

  validateMobile = (oValidateItem) ->
    $dom = oValidateItem.$dom
    val = trimDomVal($dom)
    regExp = /^(09)[0-9]{8}$/
    setErrInfo(oValidateItem, 'mobile') if val and !regExp.test(val)

  validateRocId = (oValidateItem) ->
    $dom = oValidateItem.$dom
    val = trimDomVal($dom)
    regExp = /^[A-Z][0-9]{9}$/
    setErrInfo(oValidateItem, 'rocId') if val and !regExp.test(val)

  validateWord = (oValidateItem) ->
    $dom = oValidateItem.$dom
    val = trimDomVal($dom)
    regExp = new RegExp('^[0-9a-zA-Z]*$')
    setErrInfo(oValidateItem, 'word', true) unless regExp.test(val)

  ### 設置檢查必填 ###
  $self.setRequire = ($dom) ->
    regValidate($dom, 'require')

  ### 設置檢查數字 ###
  $self.setNum = ($dom) ->
    regValidate($dom, 'num')

  ### 設置檢查最小長度 ###
  $self.setMinLength = ($dom, length) ->
    regValidate($dom, 'minLength', (oValidateInfo)->
      oValidateInfo.length = length
    )

  ### 設置檢查只能英數字 ###
  $self.setWord = ($dom) ->
    regValidate($dom, 'word')

  ### 設置檢查 email 格式 ###
  $self.setEmail = ($dom) ->
    regValidate($dom, 'email')

  ### 設置檢查手機格式 ###
  $self.setMobile = ($dom) ->
    $dom.attr('maxLength', 10);
    regValidate($dom, 'mobile')

  ### 設置檢查身分證格式 ###
  $self.setRocId = ($dom) ->
    $dom.attr('maxLength', 10);
    regValidate($dom, 'rocId')

  ### 開始檢查格式 ###
  $self.validate = ->
    setValidateDef()
    caro.forEach(_validateMap, (oValidateItem) ->
      validateRequire(oValidateItem) if(oValidateItem.require)
      validateNum(oValidateItem) if(oValidateItem.num)
      validateMinLength(oValidateItem) if(oValidateItem.minLength)
      validateWord(oValidateItem) if(oValidateItem.word)
      validateEmail(oValidateItem) if(oValidateItem.email)
      validateMobile(oValidateItem) if(oValidateItem.mobile)
      validateRocId(oValidateItem) if(oValidateItem.rocId)
    )
    _errInfo

  if(requireAll)
    $doms = $self.find('input, select, textarea')
    $doms.each((i, $dom) ->
      $dom = $($dom)
      $self.setRequire($dom)
    )

  $self