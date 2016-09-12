
/*
捲軸自動滑動到 DOM 定點的功能
Depend on plugin scrollTo of gsap
 */
cf.regModule('cfScroll', function($contents, opt) {
  var $self, _aftScroll, _basicY, _befScroll, _duration, _ease, _isLiveTop, _nowIndex, _offsetTop, _offsetTopArr, _onScroll, _triggerName, caro, getContentTop, getOffsetTopArr, scrollToNowIndex, tm;
  if (opt == null) {
    opt = {};
  }
  $self = this;
  caro = cf.require('caro');
  tm = cf.require('TweenMax');
  $self.$$offsetTopArr = _offsetTopArr = [];
  _nowIndex = 0;

  /* 綁定 scroll 的 name space */
  _triggerName = 'scroll.cfScroll';

  /* 判定捲動到定點的 Y 軸基準線, 可以是回傳 num 的 fn, 預設為本身高度的一半 */
  _basicY = opt.basicY || function() {
    return $self.height() / 2;
  };

  /* 每個 $content 的 top 基準位移 */
  _offsetTop = opt.offsetTop || 0;

  /* 是否要及時更新 top 資訊 */
  _isLiveTop = opt.isLiveTop;

  /* 捲動秒數, 設為 0 代表直接跳到該位置 */
  _duration = !caro.isUndefined(opt.duration) ? opt.duration : 1;

  /* gsap 捲動 ease 效果 */
  _ease = opt.ease || Power2.easeOut;

  /* 捲動前的 cb, return false 則不捲動 */
  _befScroll = opt.befScroll;

  /* 捲動時的 cb */
  _onScroll = opt.onScroll;

  /* 捲動後的 cb */
  _aftScroll = opt.aftScroll;
  getContentTop = function($content, i) {
    var eachTop, selfTop;
    selfTop = $self.offset().top;
    eachTop = $content.offset().top;
    eachTop -= selfTop + _offsetTop;
    _offsetTopArr[i] = eachTop;
  };
  getOffsetTopArr = function() {
    caro.forEach($contents, getContentTop);
  };
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

  /* 取得現在所在的 index */
  $self.getNowIndex = function() {
    var basicY, scrollTop;
    scrollTop = $self.scrollTop();
    basicY = caro.isFunction(_basicY) ? _basicY() : _basicY;
    caro.forEach(_offsetTopArr, function(offsetTop, i) {

      /* Dom 的頂端超過基準值時, 視為閱覽當下的 Dom */
      if (scrollTop + basicY >= offsetTop) {
        _nowIndex = i;
      }
    });
    return _nowIndex;
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
  $self.updateTop = function() {
    caro.forEach($contents, getOffsetTopArr);
    return $self;
  };

  /* 綁定 scroll */
  $self.bindScroll = function() {
    $self.on(_triggerName, function(e) {
      if (_nowIndex !== null && _befScroll && _befScroll(_nowIndex, e) === false) {
        return false;
      }

      /* 偵測 scroll stop */
      clearTimeout($self.data("scrollCheck." + _triggerName));
      $self.getNowIndex();
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
  getOffsetTopArr();
  $self.bindScroll();
  $self.getNowIndex();
  return $self;
});
