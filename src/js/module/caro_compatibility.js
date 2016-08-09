
/* form 欄位相容性處理 */
cf.regModule('cfCompatibility', function() {
  var $self, _isBefIe8, cf;
  $self = this;
  cf = $self.cf;
  _isBefIe8 = cf.isBefIe8;

  /* 置換 checkbox 相容性 for label */
  $self.checkbox = function() {
    var $label, id;
    if (!_isBefIe8) {
      return;
    }
    id = $self.attr('id');
    $label = $('label[for="' + id + '"]');
    $label.remove();
    return $self.show();
  };
  return $self;
});
