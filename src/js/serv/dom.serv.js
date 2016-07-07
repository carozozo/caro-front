
/* DOM 選取器, 支援一些方便的程式 */
cf.regServ('dom', function(cf) {
  var $, _trace, caro, self, window;
  self = {};
  caro = cf.require('caro');
  window = cf.require('window');
  $ = cf.require('$');
  _trace = cf.genTraceFn('dom');
  _trace.startTrace();
  $.fn.dom = function(selector, cb) {
    var $dom;
    $dom = this.find(selector);
    if ($dom.length < 1) {
      _trace.err('Can not find Dom:', selector);
      return $dom;
    }

    /* 將 self 裡面的程式 assign 給 $dom */
    $dom = caro.assign($dom, self);
    cb && cb($dom);
    return $dom;
  };
  (function() {

    /* 屬性相關 */
    self.id = function(id) {
      if (id !== void 0) {
        this.attr('id', id);
        return this;
      }
      return this.attr('id');
    };
    self.name = function(name) {
      if (name !== void 0) {
        this.attr('name', name);
        return this;
      }
      return this.attr('name');
    };
    self.aClass = function(sClass) {
      if (sClass !== void 0) {
        this.addClass(sClass);
        return this;
      }
      return this.attr('class');
    };
    self.title = function(title) {
      if (title !== void 0) {
        this.attr('title', title);
        return this;
      }
      return this.attr('title');
    };
    self.type = function(type) {
      if (type !== void 0) {
        this.attr('type', type);
        return this;
      }
      return this.attr('type');
    };
    self.src = function(src) {
      if (src !== void 0) {
        this.attr('src', src);
        return this;
      }
      return this.attr('src');
    };
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
    self.isVisible = function() {
      return this.is(':visible');
    };
    self.isHidden = function() {
      return !this.is(':visible');
    };
    self.enable = function() {
      this.prop('disabled', false);
      return this;
    };
    self.disable = function() {
      this.prop('disabled', true);
      return this;
    };
    self.setChecked = function(bool) {
      bool = bool === true ? bool : false;
      this.prop('checked', bool);
      return this;
    };
    self.isChecked = function() {
      return this.is(':checked');
    };
  })();
  (function() {

    /* css 相關 */
    self.getCssDistance = function(cssType) {
      var px;
      px = this.css(cssType);
      return parseInt(px.replace('px'));
    };
    self.getMargin = function(direction) {
      var margin, marginStr;
      marginStr = 'margin-';
      if (direction) {
        marginStr += direction;
      }
      margin = this.css(marginStr);
      return parseInt(margin.replace('px'));
    };
    self.pointSelfToCenter = function(direction) {

      /* 改變 dom 的基準點到自己本身的中心點 */
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
    self.setCursor = function(cursor) {
      cursor = cursor || 'pointer';
      return this.css({
        cursor: cursor
      });
    };
  })();
  (function($) {

    /* UI 操作 */
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
    self.action = function(eve, fn) {
      return this.off(eve).on(eve, function(e) {
        e.preventDefault();
        e.stopPropagation();
        return fn(e);
      });
    };
    self.onClick = function(fn, nameSpace) {
      var triggerName;
      triggerName = 'click';
      if (nameSpace) {
        triggerName += '.' + nameSpace;
      }
      return this.setCursor().on(triggerName, fn);
    };
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
  (function($) {
    self.countSelf = function(msg) {
      msg = msg || '';
      return console.log('Count Dom:', this.length, msg);
    };
    self.isEmpty = function() {
      return !$.trim(this.html());
    };
    self.getVal = function(opt) {
      var lower, upper, val;
      upper = opt.upper;
      lower = opt.lower;
      val = this.val().trim();
      if (upper) {
        val.toUpperCase();
      } else if (lower) {
        val.toLowerCase();
      }
      return val;
    };
    self.getHtml = function() {

      /* 取得包含本身的 html code */
      var div, html;
      div = $('<div/>');
      div.append(this.clone());
      html = div.html();
      div.remove();
      return html;
    };
    self.getRealSize = function() {

      /* 取得當前的寬高(在 scale 之後還能正確) */
      return {
        width: this.getBoundingClientRect().width,
        height: this.getBoundingClientRect().height
      };
    };
  })($);
  return self;
});
