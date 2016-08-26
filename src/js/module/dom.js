
/*
DOM 選取器, 支援一些方便的程式
 */
cf.regModule('dom', function(selector, cb) {
  var $, $self, caro, window;
  $self = {};
  caro = cf.require('caro');
  window = cf.require('window');
  $ = cf.require('$');
  if (caro.isFunction(selector)) {
    cb = selector;
    selector = null;
  }
  if (selector) {
    $self = this.find(selector);
  } else {
    $self = this;
  }

  /* 屬性相關 */
  (function() {

    /* 設置/取得 id */
    $self.id = function(id) {
      if (id !== void 0) {
        this.attr('id', id);
        return this;
      }
      return this.attr('id');
    };

    /* 設置/取得 name */
    $self.name = function(name) {
      if (name !== void 0) {
        this.attr('name', name);
        return this;
      }
      return this.attr('name');
    };

    /* 設置/取得 class */
    $self.aClass = function(sClass) {
      if (sClass !== void 0) {
        this.addClass(sClass);
        return this;
      }
      return this.attr('class');
    };

    /* 設置/取得 title */
    $self.title = function(title) {
      if (title !== void 0) {
        this.attr('title', title);
        return this;
      }
      return this.attr('title');
    };

    /* 設置/取得 type */
    $self.type = function(type) {
      if (type !== void 0) {
        this.attr('type', type);
        return this;
      }
      return this.attr('type');
    };

    /* 設置/取得 src */
    $self.src = function(src) {
      if (src !== void 0) {
        this.attr('src', src);
        return this;
      }
      return this.attr('src');
    };

    /* 設置/取得 href */
    $self.href = function(href, target) {
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
    $self.ifVisible = function() {
      return this.is(':visible');
    };

    /* 是否為隱藏 */
    $self.ifHidden = function() {
      return !this.is(':visible');
    };

    /* 設為 enable */
    $self.enable = function() {
      this.prop('disabled', false);
      return this;
    };

    /* 設為 disable */
    $self.disable = function() {
      this.prop('disabled', true);
      return this;
    };

    /* 設為 checked / unchecked */
    $self.setChecked = function(bool) {
      if (bool == null) {
        bool = true;
      }
      this.prop('checked', bool);
      return this;
    };

    /* 是否為 checked */
    $self.ifChecked = function() {
      return this.is(':checked');
    };
  })();

  /* css 相關 */
  (function() {

    /* 取得 css 設置的 top/left/right/bottom...等距離 */
    $self.getCssDistance = function(cssType) {
      var px;
      px = this.css(cssType);
      return parseInt(px.replace('px'));
    };

    /* 取得 css 的 width string */
    $self.getCssWidth = function() {
      var $clone, width;
      $clone = this.clone();
      width = $clone.appendTo('body').wrap('<div style="display: none"></div>').css('width');
      $clone.remove();
      return width;
    };

    /* 取得 css 的 height string */
    $self.getCssHeight = function() {
      var $clone, height;
      $clone = this.clone();
      height = $clone.appendTo('body').wrap('<div style="display: none"></div>').css('height');
      $clone.remove();
      return height;
    };

    /* 設置滑鼠指標 */
    $self.setCursor = function(cursor) {
      cursor = cursor || 'pointer';
      return this.css({
        cursor: cursor
      });
    };
  })();

  /* UI 操作 */
  (function($) {

    /* 觸發 blur 後, 將裡面的值轉大寫 */
    $self.blurUpperCase = function(nameSpace) {
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
    $self.action = function(eve, fn) {
      return this.off(eve).on(eve, function(e) {
        fn(e);
      });
    };

    /* on('click') 方便使用版 */
    $self.onClick = function(fn, nameSpace) {
      var triggerName;
      triggerName = 'click';
      if (nameSpace) {
        triggerName += '.' + nameSpace;
      }
      return this.setCursor().off(triggerName).on(triggerName, fn);
    };

    /* 按下 Enter 鍵後觸發的 fn */
    $self.onPressEnter = function(fn, nameSpace) {
      var triggerName;
      triggerName = 'keyup';
      if (nameSpace) {
        triggerName += '.' + nameSpace;
      }
      return this.on(triggerName, function(e) {
        if (e.which === 13) {
          fn(e);
        }
      });
    };
  })($);

  /* Unit 相關 */
  (function($) {

    /* .each() 進階版, 直接賦予 dom 屬性 */
    $self.eachDom = function(cb) {
      return $self.each(function(i, element) {
        var $dom;
        $dom = $(element).dom();
        return cb && cb($dom, i);
      });
    };

    /* $.map() 進階版, 直接賦予 dom 屬性, 並回傳 dom array */
    $self.mapDom = function(cb) {
      var arr;
      arr = [];
      $self.each(function(i, element) {
        var $dom;
        $dom = $(element).dom();
        cb && cb($dom, i);
        return arr.push($dom);
      });
      return arr;
    };

    /* 判斷本身是否沒任何 html 內容 */
    $self.ifEmpty = function() {
      return this.html() === '';
    };

    /* 取得包含本身的 html code */
    $self.getHtml = function() {
      var div, html;
      div = $('<div/>');
      div.append(this.clone());
      html = div.html();
      div.remove();
      return html;
    };
  })($);
  cb && cb($self);
  return $self;
});
