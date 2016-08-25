cf.router.regPage('module/cfValidator', function(cf, $page) {
  var $emailInput, $errInfoBox1, $errInfoBox2, $form1, $form2, $minLengthInput, $mobileInput, $numInput, $requireCheckbox, $requireInput, $requireNumInput, $rocIdInput, $submitBtn1, $submitBtn2, $wordInput, bgColorArr;
  bgColorArr = cf.data('bgColorArr');
  $form1 = $page.dom('#form1');
  $requireInput = $form1.dom('#requireInput');
  $numInput = $form1.dom('#numInput');
  $minLengthInput = $form1.dom('#minLengthInput');
  $emailInput = $form1.dom('#emailInput');
  $mobileInput = $form1.dom('#mobileInput');
  $rocIdInput = $form1.dom('#rocIdInput');
  $wordInput = $form1.dom('#wordInput');
  $submitBtn1 = $page.dom('#submitBtn1');
  $errInfoBox1 = $page.dom('#errInfoBox1');
  $form1.cfValidator().setRequire($requireInput).setNum($numInput).setMinLength($minLengthInput, 3).setEmail($emailInput).setMobile($mobileInput).setRocId($rocIdInput).setWord($wordInput);
  $submitBtn1.onClick(function() {
    var errInfo;
    errInfo = $form1.validate();
    errInfo = JSON.stringify(errInfo, null, 2);
    $errInfoBox1.html(errInfo);
  });
  $form2 = $page.dom('#form2');
  $requireNumInput = $form2.dom('#requireNumInput');
  $requireCheckbox = $form2.dom('#requireCheckbox');
  $submitBtn2 = $page.dom('#submitBtn2');
  $errInfoBox2 = $page.dom('#errInfoBox2');
  $form2.cfValidator().setRequire([$requireNumInput, $requireCheckbox]).setNum($requireNumInput);
  $submitBtn2.onClick(function() {
    var errInfo;
    errInfo = $form2.validate();
    errInfo = JSON.stringify(errInfo, null, 2);
    $errInfoBox2.html(errInfo);
  });
  return $page;
});
