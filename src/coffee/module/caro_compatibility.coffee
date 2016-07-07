### form 欄位相容性處理 ###
cf.regModule 'caroCompatibility', ->
  $self = this
  cf = $self.cf
  _isBefIe8 = cf.isBefIe8

  $self.checkbox = ->
    if !_isBefIe8
      return
    name = $self.attr('name')
    $label = $('label[for="' + name + '"]')
    $label.remove()
    $self.show()

  $self