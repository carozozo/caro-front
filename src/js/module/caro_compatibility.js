
/* form 欄位相容性處理 */
cf.regModule('caroCompatibility', function() {
  var $self, _isBefIe8, cf;
  $self = this;
  cf = $self.cf;
  _isBefIe8 = cf.isBefIe8;
  $self.checkbox = function() {
    var $label, name;
    if (!_isBefIe8) {
      return;
    }
    name = $self.attr('name');
    $label = $('label[for="' + name + '"]');
    $label.remove();
    return $self.show();
  };
  return $self;
});
