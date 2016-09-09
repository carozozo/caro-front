cf.router.regPage('module/cfSplitText', function(cf) {
  var $demoText, $page, reverseText, setTextCss, tm;
  $page = this;
  tm = cf.require('TweenMax');
  setTextCss = function($text) {
    $text.css({
      border: 'solid 2px #000',
      padding: 3,
      'margin-left': 3
    });
  };
  reverseText = function() {
    return $demoText.reverseText && $demoText.reverseText();
  };
  $demoText = $page.dom('#demoText');
  $page.dom('#charBtn').onClick(function() {
    reverseText();
    return $demoText.cfSplitText({
      charCb: function($char) {
        setTextCss($char);
      }
    });
  });
  $page.dom('#wordBtn').onClick(function() {
    reverseText();
    return $demoText.cfSplitText({
      isToChar: false,
      isToWord: true,
      wordCb: function($word) {
        setTextCss($word);
      }
    });
  });
  $page.dom('#charWordBtn').onClick(function() {
    reverseText();
    return $demoText.cfSplitText({
      isToWord: true,
      charCb: function($char) {
        setTextCss($char);
      },
      wordCb: function($word) {
        setTextCss($word);
      }
    });
  });
  $page.dom('#reverseBtn').onClick(function() {
    return reverseText();
  });
  return $page;
});
