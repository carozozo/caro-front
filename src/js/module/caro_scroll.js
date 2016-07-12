
/* 捲軸自動滑動到 DOM 定點 的功能 */
cf.regModule('caroScroll', function($contents, opt) {
  var $self, $window, _aftScroll, _basicY, _befScroll, _duration, _ease, _isLiveTop, _nowIndex, _offsetTop, _offsetTopArr, _onScroll, _triggerName, caro, cf, getContentTop, getOffsetTopArr, scrollToNowIndex, tm;
  if (opt == null) {
    opt = {};
  }
  $self = this;
  cf = $self.cf;
  $window = cf.$window;
  caro = cf.require('caro');
  tm = cf.require('TweenMax');
  _offsetTopArr = [];
  _nowIndex = 0;

  /* Y 軸基準線 */
  _basicY = opt.basicY;

  /* 每個 dom 的 top 基準位移 */
  _offsetTop = opt.offsetTop || 0;

  /* 是否要及時更新 top 資訊 */
  _isLiveTop = opt.isLiveTop;

  /* 捲動時間 */
  _duration = !caro.isUndefined(opt.duration) ? opt.duration : 1;

  /* 捲動 ease 效果 */
  _ease = opt.ease || Power2.easeOut;

  /* 綁定 scroll 的 name space */
  _triggerName = opt.triggerName ? 'scroll.caroScroll.' + opt.triggerName : 'scroll.caroScroll';

  /* 捲動前的 cb */
  _befScroll = opt.befScroll;

  /* 捲動時的 cb */
  _onScroll = opt.onScroll;

  /* 捲動後的 cb */
  _aftScroll = opt.aftScroll;
  getContentTop = function($content, i) {
    var eachTop;
    eachTop = $content.position().top;
    eachTop -= _offsetTop;
    _offsetTopArr[i] = eachTop;
  };
  getOffsetTopArr = function() {
    caro.forEach($contents, getContentTop);
  };
  $contents = cf.unit.coverDomList($contents, getContentTop);
  scrollToNowIndex = function(duration) {
    var offset;
    if (duration == null) {
      duration = null;
    }
    if (_isLiveTop) {
      getOffsetTopArr();
    }
    offset = _offsetTopArr[_nowIndex];
    if (duration === null) {
      duration = _duration;
    }
    tm.to($self, duration, {
      scrollTo: {
        y: offset
      },
      ease: _ease
    });
  };

  /* 捲動到下一個 */
  $self.scrollNext = function(duration) {
    if (++_nowIndex > _offsetTopArr.length - 1) {
      _nowIndex = 0;
    }
    scrollToNowIndex(duration);
    return $self;
  };

  /* 捲動到上一個 */
  $self.scrollPrev = function(duration) {
    if (--_nowIndex < 0) {
      _nowIndex = _offsetTopArr.length - 1;
    }
    scrollToNowIndex(duration);
    return $self;
  };

  /* 捲動到指定的 index */
  $self.scrollTo = function(i, duration) {
    _nowIndex = i;
    scrollToNowIndex(duration);
    return $self;
  };

  /* 重新掃描內容的高度位置 */
  $self.updatePosition = function() {
    caro.forEach($contents, getOffsetTopArr);
    return $self;
  };

  /* 綁定 scroll */
  $self.bindScroll = function() {

    /* 避免重複綁定 */
    $self.off(_triggerName).on(_triggerName, function(e) {
      var basicY, scrollTop;
      if (_befScroll && _befScroll(_nowIndex, e) === false) {
        return false;
      }

      /* 偵測 scroll stop */
      clearTimeout($self.data("scrollCheck." + _triggerName));
      scrollTop = $self.scrollTop();
      basicY = null;
      if (_basicY) {
        basicY = caro.isFunction(_basicY) ? _basicY() : _basicY;
      } else {
        basicY = $window.height() / 2;
      }
      caro.forEach(_offsetTopArr, function(offsetTop, i) {

        /* Dom 的頂端超過基準值時, 視為閱覽當下的 Dom */
        if (scrollTop + basicY >= offsetTop) {
          _nowIndex = i;
        }
      });
      _onScroll && _onScroll(_nowIndex, e);
      $self.data("scrollCheck." + _triggerName, setTimeout(function() {
        return _aftScroll && _aftScroll(_nowIndex, e);
      }, 250));
    });
    return $self;
  };

  /* 不綁定 scroll */
  $self.unbindScroll = function() {
    $self.off(_triggerName);
    return $self;
  };
  $self.bindScroll();
  $self._offsetTopArr = _offsetTopArr;
  return $self;
});
