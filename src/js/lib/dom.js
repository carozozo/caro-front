
/* DOM 選取器, 支援一些方便的程式 */
cf.regLib('dom', function(cf) {
  var $, _trace, caro, self, window;
  self = {};
  caro = cf.require('caro');
  window = cf.require('window');
  $ = cf.require('$');
  _trace = cf.genTraceFn('dom');
  _trace.startTrace();

  /* jQuery.find 進階版, 賦予 self 的所有程式給取得的 DOM */
  $.fn.dom = function(selector, cb) {
    var $dom;
    if (caro.isFunction(selector)) {
      cb = selector;
    }
    if (selector) {
      $dom = this.find(selector);
    } else {
      $dom = this;
    }
    if ($dom.length < 1) {
      _trace.err('Can not find Dom:', selector);
      return $dom;
    }

    /* 將 self 裡面的程式 assign 給 $dom */
    $dom = caro.assign($dom, self);
    cb && cb($dom);
    return $dom;
  };

  /* 屬性相關 */
  (function() {

    /* 設置/取得 id */
    self.id = function(id) {
      if (id !== void 0) {
        this.attr('id', id);
        return this;
      }
      return this.attr('id');
    };

    /* 設置/取得 name */
    self.name = function(name) {
      if (name !== void 0) {
        this.attr('name', name);
        return this;
      }
      return this.attr('name');
    };

    /* 設置/取得 class */
    self.aClass = function(sClass) {
      if (sClass !== void 0) {
        this.addClass(sClass);
        return this;
      }
      return this.attr('class');
    };

    /* 設置/取得 title */
    self.title = function(title) {
      if (title !== void 0) {
        this.attr('title', title);
        return this;
      }
      return this.attr('title');
    };

    /* 設置/取得 type */
    self.type = function(type) {
      if (type !== void 0) {
        this.attr('type', type);
        return this;
      }
      return this.attr('type');
    };

    /* 設置/取得 src */
    self.src = function(src) {
      if (src !== void 0) {
        this.attr('src', src);
        return this;
      }
      return this.attr('src');
    };

    /* 設置/取得 href */
    self.href = function(href, target) {
      if (href !== void 0) {
        this.attr('href', href);
        if (target !== void 0) {
          this.attr('target', target);
        }
        return this;
      }
      return this.attr('href');
    };

    /* 是否為可見 */
    self.isVisible = function() {
      return this.is(':visible');
    };

    /* 是否為隱藏 */
    self.isHidden = function() {
      return !this.is(':visible');
    };

    /* 設為 enable */
    self.enable = function() {
      this.prop('disabled', false);
      return this;
    };

    /* 設為 disable */
    self.disable = function() {
      this.prop('disabled', true);
      return this;
    };

    /* 設為 checked */
    self.setChecked = function(bool) {
      if (bool == null) {
        bool = false;
      }
      this.prop('checked', bool);
      return this;
    };

    /* 是否為 checked */
    self.isChecked = function() {
      return this.is(':checked');
    };
  })();

  /* css 相關 */
  (function() {

    /* 取得 css 設置的 top/left/right/bottom...等距離 */
    self.getCssDistance = function(cssType) {
      var px;
      px = this.css(cssType);
      return parseInt(px.replace('px'));
    };

    /* 取得 margin-top / margin-bottom / margin-left / margin-right 距離 */
    self.getMargin = function(direction) {
      var margin, marginStr;
      marginStr = 'margin-';
      if (direction) {
        marginStr += direction;
      }
      margin = this.css(marginStr);
      return parseInt(margin.replace('px'));
    };

    /* 改變 dom 的基準點到自己本身的中心點 */
    self.marginSelfToCenter = function(direction) {
      var height, width;
      width = this.width();
      height = this.height();
      if (direction === 'x') {
        this.css({
          'margin-left': -(width / 2)
        });
      } else if (direction === 'y') {
        this.css({
          'margin-top': -(height / 2)
        });
      } else {
        this.css({
          'margin-left': -(width / 2),
          'margin-top': -(height / 2)
        });
      }
      return this;
    };

    /* 設置滑鼠指標 */
    self.setCursor = function(cursor) {
      cursor = cursor || 'pointer';
      return this.css({
        cursor: cursor
      });
    };
  })();

  /* UI 操作 */
  (function($) {

    /* 觸發 blur 後, 將裡面的值轉大寫 */
    self.blurUpperCase = function(nameSpace) {
      var triggerName;
      triggerName = 'blur';
      if (nameSpace) {
        triggerName += '.' + nameSpace;
      }
      return this.on(triggerName, function() {
        var $dom, val;
        $dom = $(this);
        val = $dom.val().trim().toUpperCase();
        return $dom.val(val);
      });
    };

    /* 先 off 然後 on */
    self.action = function(eve, fn) {
      return this.off(eve).on(eve, function(e) {
        e.preventDefault();
        e.stopPropagation();
        return fn(e);
      });
    };

    /* on('click') 方便使用版 */
    self.onClick = function(fn, nameSpace) {
      var triggerName;
      triggerName = 'click';
      if (nameSpace) {
        triggerName += '.' + nameSpace;
      }
      return this.setCursor().off(triggerName).on(triggerName, fn);
    };

    /* 整合 mouseenter, mouseleave 方便使用版 */
    self.onEnterAndLeave = function(fn1, fn2, nameSpace) {
      var triggerName1, triggerName2;
      triggerName1 = 'mouseenter';
      triggerName2 = 'mouseleave';
      if (nameSpace) {
        triggerName1 += '.' + nameSpace;
        triggerName2 += '.' + nameSpace;
      }
      return this.on(triggerName1, fn1).on(triggerName2, fn2);
    };

    /* 按下 Enter 鍵後觸發的 trigger */
    self.onPressEnter = function(fn, nameSpace) {
      var triggerName;
      triggerName = 'keyup';
      if (nameSpace) {
        triggerName += '.' + nameSpace;
      }
      return this.on(triggerName, function(e) {
        if (e.which === 13) {
          return fn(e);
        }
      });
    };
  })($);

  /* Unit 相關 */
  (function($) {

    /* trace 用, 計算本身數量 */
    self.countSelf = function(msg) {
      msg = msg || '';
      return console.log('Count Dom:', this.length, msg);
    };

    /* 判斷本身是否沒任何 html 內容 */
    self.isEmpty = function() {
      return this.html().trim();
    };

    /* 同 .val(), 並自動 trim() */
    self.getVal = function() {
      var val;
      val = this.val() || '';
      return val.trim();
    };

    /* 同 .getVal(), 並 uppercase */
    self.getUpperVal = function() {
      return this.getVal().toUpperCase();
    };

    /* 同 .getVal(), 並 lowercase */
    self.getLowerVal = function() {
      return this.getVal().toLowerCase();
    };

    /* 取得包含本身的 html code */
    self.getHtml = function() {
      var div, html;
      div = $('<div/>');
      div.append(this.clone());
      html = div.html();
      div.remove();
      return html;
    };

    /* 取得當前的寬高(在 scale 之後還能正確) */
    self.getRealSize = function() {
      return {
        width: this.getBoundingClientRect().width,
        height: this.getBoundingClientRect().height
      };
    };
  })($);
  return self;
});
