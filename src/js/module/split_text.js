
/*
將目標內的文字拆解成 div
 */
cf.regModule('cfSplitText', function(opt) {
  var $blankSpan, $self, _charCb, _isToChar, _isToWord, _wordCb, blankWidth, originText, splitChar, wordArr;
  if (opt == null) {
    opt = {};
  }
  $self = this;

  /* 是否拆解每個字元 */
  _isToChar = opt.isToChar === false ? false : true;

  /* 是否以空白字元拆解, 拆解後稱為字組 */
  _isToWord = opt.isToWord;

  /* 放置每個字元之後呼叫的 cb */
  _charCb = opt.charCb;

  /* 放置每個字組之後呼叫的 cb */
  _wordCb = opt.wordCb;
  originText = $self.text();

  /* 取得空白字元的寬度 */
  $blankSpan = $('<span>&nbsp;</span>');
  $self.append($blankSpan);
  blankWidth = $blankSpan.width();
  $blankSpan.remove();
  splitChar = function($dom) {
    var text;
    text = $dom.text();
    $dom.empty();
    cf.forEach(text, function(char, i) {
      var $char, css;
      css = {
        display: 'inline-block'
      };
      if (char === ' ') {
        char = '&nbsp;';
      }
      $char = $('<div/>').addClass('cfSplitTextChar').html(char).css(css).appendTo($dom);
      _charCb && _charCb($char, i);
    });
  };
  if (_isToWord) {
    $self.empty();
    wordArr = originText.split(' ');
    cf.forEach(wordArr, function(word, i) {
      var $word, css;
      css = {
        display: 'inline-block'
      };
      if (i > 0) {
        css['margin-left'] = blankWidth;
      }
      $word = $('<div/>').addClass('cfSplitTextWord').text(word).css(css).appendTo($self);
      if (_isToChar) {
        splitChar($word);
      }
      _wordCb && _wordCb($word, i);
    });
  } else {
    splitChar($self, true);
  }

  /* 回復成原本的 text 內容 */
  $self.reverseText = function() {
    $self.text(originText);
    return $self;
  };
  return $self;
});
