### form 欄位相容性處理 ###
cf.regModule 'caroCompatibility', ->
  $self = this
  cf = $self.cf
  _isBefIe8 = cf.isBefIe8

  ### 置換 checkbox 相容性 for label ###
  $self.checkbox = ->
    return unless _isBefIe8
    id = $self.attr('id')
    $label = $('label[for="' + id + '"]')
    $label.remove()
    $self.show()

  $self