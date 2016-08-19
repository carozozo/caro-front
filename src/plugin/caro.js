/*! caro - v0.23.9- 2016-3-22 */
(function(g) {
  var caro, isNode;
  caro = typeof _ !== "undefined" && _ !== null ? _ : {};
  g.caro = caro;
  isNode = (function() {
    return (typeof global !== "undefined" && global !== null) && (typeof module !== "undefined" && module !== null) && (typeof exports !== "undefined" && exports !== null);
  })();
  if (isNode) {
    caro = require('lodash').runInContext();
    module.exports = caro;
    global.caro = caro;
  }
  return caro.isNode = isNode;
})(this);


/*
 * Array
 * @namespace caro
 * @author Caro.Huang
 */
(function() {
  var self;
  self = caro;

  /*
   * remove all items in array
   * @param {[]} arr
   * @returns {array}
   */
  self.cleanArr = function(arr) {
    arr.splice(0, arr.length);
    return arr;
  };

  /*
   * push value into array if not exists
   * @param {[]} arr
   * @param {...*} value
   * @returns {array}
   */
  self.pushNoDuplicate = function(arr, val) {
    var args;
    args = caro.drop(arguments);
    caro.forEach(args, function(val) {
      if (arr.indexOf(val) > -1) {
        return;
      }
      arr.push(val);
    });
    return arr;
  };

  /*
   * will not push to array if value is empty
   * @param {[]} arr
   * @param {...*} value
   * @returns {array}
   */
  self.pushNoEmptyVal = function(arr, val) {
    var args;
    args = caro.drop(arguments);
    caro.forEach(args, function(arg) {
      if (caro.isEmptyVal(arg)) {
        return;
      }
      arr.push(arg);
    });
    return arr;
  };

  /*
   * remove empty-value in array
   * @param {[]} arr
   * @returns {array}
   */
  self.pullEmptyVal = function(arr) {
    return caro.remove(arr, function(n) {
      return caro.isEmptyVal(n);
    });
  };

  /*
   * only keep basic-value in array
   * @param {[]} arr
   * @returns {array}
   */
  self.pullUnBasicVal = function(arr) {
    return caro.remove(arr, function(n) {
      return !caro.isBasicVal(n);
    });
  };

  /*
   * pick up item from array by random
   * @param {[]} arr
   * @returns {boolean} [removeFromArr=false]
   */
  self.randomPick = function(arr, removeFromArr) {
    var randIndex;
    if (removeFromArr == null) {
      removeFromArr = false;
    }
    randIndex = caro.randomInt(arr.length - 1);
    if (!removeFromArr) {
      return arr[randIndex];
    }
    return arr.splice(randIndex, 1)[0];
  };

  /*
   * get sum of value in array
   * @param {[]} arr
   * @param {boolean} [force=false] if cover to number when argument is not number
   * @returns {number}
   */
  self.sumOfArr = function(arr, force) {
    if (force == null) {
      force = false;
    }
    return caro.reduce(arr, function(total, n) {
      if (!caro.isNumber(n) && !force) {
        return total;
      }
      return total + Number(n);
    });
  };
})();


/*
 * Helper
 * @author Caro.Huang
 */
(function() {
  var self;
  self = caro;

  /*
   * check all argument in array by check-function,
   * get false if check-function return false
   * @param {[]} array
   * @param {function} checkFn
   * @param {boolean} [needAllPass=true] when returnIfAllPass=true, return true when all check-result are true
   * @returns {boolean}
   */
  self.checkIfPass = function(arr, checkFn, needAllPass) {
    if (needAllPass == null) {
      needAllPass = true;
    }
    caro.forEach(arr, function(arg) {
      var result;
      result = checkFn(arg);
      if (needAllPass && result === false || !needAllPass && result === true) {
        needAllPass = !needAllPass;
        return false;
      }
    });
    return needAllPass;
  };

  /*
   * execute if first-argument is function
   * @param {function} fn
   * @param {...*} args function-arguments
   * @returns {*}
   */
  self.executeIfFn = function(fn, args) {
    args = caro.drop(arguments);
    if (caro.isFunction(fn)) {
      return fn.apply(fn, args);
    }
  };

  /*
     * format to money type like 1,000.00
     * @param {string|number} arg
     * @param {string} [type=int|sInt] format-type, if type is set, the opt will not work
     * @param {object} [opt]
     * @param {number} [opt.float=0]
     * @param [opt.decimal=.]
     * @param [opt.separated=,]
     * @param [opt.prefix]
     * @returns {string}
   */
  self.formatMoney = function(arg, type, opt) {
    var aStr, decimal, fStr, float, forceFloat, i, iStr, j, prefix, r, ref, s, sepLength, separated;
    r = [];
    caro.forEach(arguments, function(arg, i) {
      if (i === 0) {
        return;
      }
      if (caro.isObject(arg)) {
        return opt = arg;
      }
      if (caro.isString(arg)) {
        return type = arg;
      }
    });
    opt = opt || {};
    float = Math.abs(caro.toInteger(opt.float));
    decimal = caro.isString(opt.decimal) ? opt.decimal : '.';
    separated = caro.isString(opt.separated) ? opt.separated : ',';
    prefix = caro.isString(opt.prefix) ? opt.prefix : '';
    forceFloat = opt.forceFloat === true;
    s = arg < 0 ? '-' : '';
    switch (type) {
      case 'sInt':
        float = 0;
        prefix = '$';
        break;
      case 'int':
        float = 0;
    }
    arg = caro.toNumber(arg);
    arg = caro.toString(arg);
    aStr = caro.splitStr(arg, '.');
    iStr = aStr[0];
    fStr = aStr[1] ? aStr[1].slice(0, float) : '';
    if (forceFloat) {
      for (i = j = 1, ref = float - fStr.length; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
        fStr += '0';
      }
    }
    sepLength = iStr.length > 3 ? iStr.length % 3 : 0;
    r.push(prefix);
    r.push(s + (sepLength ? iStr.substr(0, sepLength) + separated : ''));
    r.push(iStr.substr(sepLength).replace(/(\d{3})(?=\d)/g, '$1' + separated));
    r.push(fStr ? decimal + fStr : '');
    return r.join('');
  };

  /*
   * get function name
   * @param {*} fn
   * @returns {string|*|String}
   */
  self.getFnName = function(fn) {
    var r;
    if (!caro.isFunction(fn)) {
      return null;
    }
    r = fn.toString();
    r = r.substr('function '.length);
    r = r.substr(0, r.indexOf('('));
    return r;
  };

  /*
   * get function content
   * @param {*} fn
   * @returns {string|*|String}
   */
  self.getFnBody = function(fn) {
    var entire;
    if (!caro.isFunction(fn)) {
      return null;
    }
    entire = fn.toString();
    return entire.slice(entire.indexOf('{') + 1, entire.lastIndexOf('}'));
  };

  /*
   * get stack-information list
   * @param {number} [start=0] the start-index of list
   * @param {number} [length=null] the list length you want get
   * @returns {array}
   */
  self.getStackList = function(start, length) {
    var aStack, end, err, r, stack;
    r = [];
    err = new Error();
    stack = err.stack;
    aStack = caro.splitByWrap(stack).slice(2);
    start = start || 0;
    length = length || null;
    if (length) {
      end = start + length - 1;
    } else {
      end = aStack.length - 1;
    }
    caro.forEach(aStack, function(sStack, i) {
      var data, info, reg, reg2;
      if (i < start || i > end) {
        return;
      }
      data = {};
      reg = /^\s*at\s*/i;
      sStack = sStack.replace(reg, '');
      reg = /(.*)\s+\((.*):(\d*):(\d*)\)/gi;
      reg2 = /()(.*):(\d*):(\d*)/gi;
      info = reg.exec(sStack) || reg2.exec(sStack);
      if (!info || info.length !== 5) {
        return;
      }
      data.stack = info[0];
      data.method = info[1];
      data.path = info[2];
      data.line = info[3];
      data.position = info[4];
      data.file = self.getFileName(data.path);
      return r.push(data);
    });
    return r;
  };

  /*
   * easy-use for setInterval
   * @param {function} fn the function you want to exclude
   * @param {integer} ms milliseconds
   * @param {integer} [times=0] the times that function exclude, will never stop when 0
   * @returns {string}
   */
  self.setInterval = function(fn, ms, times) {
    var count, interval;
    if (times == null) {
      times = 0;
    }
    count = 0;
    return interval = setInterval(function() {
      if (times && count === times) {
        clearInterval(interval);
        return;
      }
      if (fn() === false && !times) {
        clearInterval(interval);
      }
      return count++;
    }, ms);
  };

  /*
   * create random string
   * @param {number} len the length of random
   * @param {object} [opt]
   * @param {boolean} [opt.lower=true] if include lowercase
   * @param {boolean} [opt.upper=true] if include uppercase
   * @param {boolean} [opt.num=true]
   * @param {string} [opt.exclude=[]] the charts that excluded
   * @returns {string}
   */
  self.random = function(len, opt) {
    var chars, exclude, i, lower, num, text, upper;
    text = '';
    chars = [];
    len = parseInt(len) ? parseInt(len) : 1;
    opt = opt || {};
    lower = opt.lower !== false;
    upper = opt.upper !== false;
    num = opt.num !== false;
    exclude = opt.exclude || [];
    exclude = caro.splitStr(exclude, ',');
    if (lower) {
      chars.push('abcdefghijklmnopqrstuvwxyz');
    }
    if (upper) {
      chars.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    }
    if (num) {
      chars.push('0123456789');
    }
    chars = chars.join('');
    caro.forEach(exclude, function(excludeStr) {
      chars = caro.replaceAll(chars, excludeStr, '');
    });
    i = 0;
    while (i < len) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
      i++;
    }
    return text;
  };

  /*
   * random an integer
   * @param {number} max
   * @param {number} [min=0]
   * @returns {number}
   */
  self.randomInt = function(max, min) {
    var rand;
    max = parseInt(max) || 0;
    min = parseInt(min) || 0;
    if (min > max) {
      min = 0;
    }
    rand = Math.random() * (max - min + 1);
    return Math.floor(rand + min);
  };

  /*
   * serialize object-arguments to url
   * @param {string} url
   * @param {object} oArgs the argument you want to cover (e.g. {a:1, b:2})
   * @param {boolean} [coverEmpty=false] if cover when value is empty
   * @returns {*}
   */
  self.serializeUrl = function(url, oArgs, coverEmpty) {
    var aArgs, count;
    if (coverEmpty == null) {
      coverEmpty = false;
    }
    count = 0;
    aArgs = ['?'];
    caro.forEach(oArgs, function(val, key) {
      if (caro.isEmptyVal(val)) {
        if (!coverEmpty) {
          return;
        }
        val = '';
      }
      if (count > 0) {
        aArgs.push('&');
      }
      aArgs.push(key);
      aArgs.push('=');
      aArgs.push(val);
      count++;
    });
    return url += aArgs.join('');
  };
})();


/*
 * Loop
 * @author Caro.Huang
 */
(function() {
  var self;
  self = caro;

  /*
   * for-loop function
   * @param {function} fn for-loop function, will break-loop when return false
   * @param {number} start
   * @param {number} end
   * @param {number} step add the step in each function-called
   */
  self.loop = function(fn, start, end, step) {
    var compareFn;
    if (start == null) {
      start = 0;
    }
    if (end == null) {
      end = 0;
    }
    if (step == null) {
      step = 1;
    }
    compareFn = caro.lte;
    if (start > end) {
      compareFn = caro.gte;
      step = -step;
    }
    while (compareFn(start, end)) {
      if (fn(start) === false) {
        break;
      }
      start += step;
    }
  };
})();


/*
 * Object
 * @author Caro.Huang
 */
(function() {
  var self;
  self = caro;

  /*
   * assign elements to from obj2 to obj1 by keys
   * won't replace obj1 value if exists when argument-replace is false
   * @param {object} obj1
   * @param {object} obj2
   * @param {array} keys the keys in obj2 that you want sand to obj1
   * @param {boolean} [replace=true] won't replace obj1 elements if obj1 has same key when false
   */
  self.assignByKeys = function(obj1, obj2, keys, replace) {
    if (replace == null) {
      replace = true;
    }
    return caro.reduce(keys, function(obj, key) {
      if (caro.has(obj2, key) && (replace || !caro.has(obj, key))) {
        obj[key] = obj2[key];
      }
      return obj;
    }, obj1);
  };

  /*
   * catch other object-values to target-object
   * @param {object} obj
   * @return {object}
   */
  self.catching = function(obj) {
    var args;
    args = caro.drop(arguments);
    caro.forEach(args, function(eachObj) {
      return caro.forEach(eachObj, function(eachVal, eachKey) {
        if (obj.hasOwnProperty(eachKey)) {
          return obj[eachKey] = eachVal;
        }
      });
    });
    return obj;
  };

  /*
   * group by argument type
   * @param {object|array} arg
   * @return {object}
   */
  self.classify = function(arg) {
    var aArr, aBool, aFn, aNum, aObj, aStr;
    aStr = [];
    aBool = [];
    aArr = [];
    aNum = [];
    aObj = [];
    aFn = [];
    caro.forEach(arg, function(a) {
      if (caro.isBoolean(a)) {
        return aBool.push(a);
      } else if (caro.isString(a)) {
        aStr.push(a);
      } else if (caro.isNumber(a)) {
        return aNum.push(a);
      } else if (caro.isArray(a)) {
        return aArr.push(a);
      } else if (caro.isPlainObject(a)) {
        return aObj.push(a);
      } else if (caro.isFunction(a)) {
        return aFn.push(a);
      }
    });
    return {
      bool: aBool,
      str: aStr,
      num: aNum,
      arr: aArr,
      obj: aObj,
      fn: aFn
    };
  };

  /*
   * get keys that object1 has but object2 not
   * @param {object} obj1
   * @param {object} obj2
   * @return {array}
   */
  self.differentKeys = function(obj1, obj2, reverse) {
    var keys1, keys2;
    keys1 = caro.keys(obj1);
    keys2 = caro.keys(obj2);
    if (!reverse) {
      return caro.difference(keys1, keys2);
    }
    return caro.difference(keys2, keys1);
  };

  /*
   * check if all keys are equal between objects
   * @param {object} obj1
   * @param {object} obj2
   * @return {boolean}
   */
  self.hasEqualKeys = function(obj1, obj2) {
    var size1, size2;
    size1 = caro.size(caro.differentKeys(obj1, obj2));
    size2 = caro.size(caro.differentKeys(obj1, obj2, true));
    return size1 === 0 && size2 === 0;
  };

  /*
   * get keys that is same between objects
   * @param {object} obj1
   * @param {object} obj2
   * @return {array}
   */
  self.sameKeys = function(obj1, obj2) {
    var diffKeys, keys;
    keys = caro.keys(obj1);
    diffKeys = caro.differentKeys(obj1, obj2);
    return caro.reduce(keys, function(result, val) {
      if (caro.indexOf(diffKeys, val) < 0) {
        result.push(val);
      }
      return result;
    }, []);
  };
})();


/*
 * Path
 * @author Caro.Huang
 */
(function() {
  var self;
  self = caro;

  /*
   * get dir-path
   * @param {string} path
   * @return {string}
   */
  self.getDirPath = function(path) {
    var filename;
    filename = caro.getFileName(path);
    return path = caro.replaceLast(path, filename, '');
  };

  /*
   * get file name in path
   * @param {string} path
   * @param {boolean} [getFull] if return file-name by full (with extend-name)
   * @return {string}
   */
  self.getFileName = function(path, getFull) {
    var extendName, lastIndex, lastIndex2;
    getFull = getFull !== false;
    lastIndex = path.lastIndexOf('\\');
    lastIndex2 = path.lastIndexOf('/');
    path = path.slice(lastIndex + 1);
    path = path.slice(lastIndex2 + 1);
    if (getFull) {
      return path;
    }
    extendName = caro.getExtendName(path);
    return path.replace(extendName, '');
  };

  /*
   * get extend name of file
   * @param {string} path
   * @param {boolean} [withDot] if return extend-name with '.'
   * @return {string}
   */
  self.getExtendName = function(path, withDot) {
    var aFileName, extendName, fileName;
    withDot = withDot !== false;
    fileName = caro.getFileName(path);
    aFileName = caro.splitStr(fileName, '.');
    if (aFileName.length === 1) {
      return '';
    }
    extendName = aFileName[aFileName.length - 1];
    if (withDot) {
      extendName = '.' + extendName;
    }
    return extendName;
  };
})();


/*
 * String
 * @author Caro.Huang
 */
(function() {
  var changeCase, self;
  self = caro;
  changeCase = function(str, type, startOrCb, end) {
    var cb, strArr;
    if (startOrCb == null) {
      startOrCb = 0;
    }
    if (end == null) {
      end = null;
    }
    cb = null;
    if (!end) {
      end = str.length;
    }
    strArr = str.split('');
    if (caro.isFunction(startOrCb)) {
      cb = startOrCb;
      caro.forEach(strArr, function(letter, i) {
        if (cb(letter, i) === true) {
          return strArr[i] = letter[type]();
        }
      });
    } else {
      caro.forEach(strArr, function(letter, i) {
        if (i >= startOrCb && i < end) {
          return strArr[i] = letter[type]();
        }
      });
    }
    return strArr.join('');
  };

  /*
   * add the head to string if not exist
   * @param {string} str
   * @param {string} addStr
   * @returns {*}
   */
  self.addHead = function(str, addStr) {
    if (!caro.startsWith(str, addStr)) {
      str = addStr + str;
    }
    return str;
  };

  /*
   * add the tail to string if not exist
   * @param {string} str
   * @param {string} addStr
   * @returns {*}
   */
  self.addTail = function(str, addStr) {
    if (!caro.isString(str)) {
      return str;
    }
    if (!caro.endsWith(str, addStr)) {
      str += addStr;
    }
    return str;
  };

  /*
   * replace the <br /> to \n
   * @param {string} str
   * @returns {string}
   */
  self.brToWrap = function(str) {
    var regex;
    regex = /<br\s*[\/]?>/gi;
    return str.replace(regex, '\n');
  };

  /*
   * insert string to another
   * @param {string} str1
   * @param {string} str2 the string want to insert
   * postion {integer} [position]
   */
  self.insertStr = function(str1, str2, position) {
    position = position || str1.length;
    return [str1.slice(0, position), str2, str1.slice(position)].join('');
  };

  /*
   * lowercase string
   * @param {string} str
   * @param {object} [opt]
   * @param {number|function} [opt.startOrCb] the start-index you want to lowercase
   * or callback-function, will lowercase when callback return true
   * @param {number} [opt.end] the end-index you want to lowercase
   * @param {boolean} [opt.force] if force cover to string
   * @returns {*}
   */
  self.lowerStr = function(str, startOrCb, end) {
    return changeCase(str, 'toLowerCase', startOrCb, end);
  };

  /*
   * replace all find in string
   * @param {string} str
   * @param {string} find
   * @param {string} replace
   * @returns {*|string}
   */
  self.replaceAll = function(str, find, replace) {
    var regex;
    find = caro.escapeRegExp(find);
    regex = new RegExp(find, 'g');
    return str.replace(regex, replace);
  };

  /*
   * replace last find in string
   * @param {string} str
   * @param {string} find
   * @param {string} replace
   * @returns {*|string}
   */
  self.replaceLast = function(str, find, replace) {
    var lastIndex, str1, str2;
    lastIndex = str.lastIndexOf(find);
    str1 = str.slice(0, lastIndex);
    str2 = str.slice(lastIndex);
    return str1 + str2.replace(find, replace);
  };

  /*
     * split to array by '\r\n' | '\n' | '\r'
     * @param {string} str
     * @returns {*}
   */
  self.splitByWrap = function(str) {
    var aWrap;
    aWrap = ['\r\n', '\r', '\n'];
    return caro.splitStr(str, aWrap);
  };

  /*
     * split string
     * @param {string} str
     * @param {string|string[]} splitter it should be string-array or string
     * @returns {*}
   */
  self.splitStr = function(str, splitter) {
    var mainSplit;
    if (caro.isArray(str)) {
      return str;
    }
    if (!splitter) {
      return [];
    }
    if (!caro.isArray(splitter)) {
      splitter = [splitter];
    }
    mainSplit = splitter[0];
    caro.forEach(splitter, function(eachSplit) {
      if (!caro.isString(eachSplit)) {
        return;
      }
      if (mainSplit.length < 2) {
        return false;
      }
      if (mainSplit.length > eachSplit.length) {
        mainSplit = eachSplit;
      }
    });
    if (!caro.isString(mainSplit)) {
      return [];
    }

    /* replace all splitter to mainSplitter
     * e.g. string='caro.huang, is handsome'; splitter=['.', ','];
     * => string='caro,huang, is handsome'
     */
    caro.forEach(splitter, function(eachSplit) {
      if (!caro.isString(eachSplit)) {
        return;
      }
      str = caro.replaceAll(str, eachSplit, mainSplit);
    });
    return str.split(mainSplit);
  };

  /*
   * check string if ("true" | not-empty) / ("false" | empty) and covert to boolean
   * @param {string} str
   * @returns {boolean}
   */
  self.strToBool = function(str) {
    str = str.toLowerCase();
    return str !== '' && str !== 'false';
  };

  /*
   * uppercase string
   * @param {string} str
   * @param {number|function} [startOrCb] the start-index you want to uppercase
   * or callback-function, will uppercase when callback return true
   * @param {number} [end] the end-index you want to uppercase
   * @returns {*}
   */
  self.upperStr = function(str, startOrCb, end) {
    return changeCase(str, 'toUpperCase', startOrCb, end);
  };

  /*
   * replace \r\n | \r | \n to <br/>
   * @param {string} str
   * @returns {string}
   */
  self.wrapToBr = function(str) {
    if (!caro.isString(str)) {
      return str;
    }
    str = str.replace(/\r\n/g, '<br />');
    str = str.replace(/\n/g, '<br />');
    str = str.replace(/\r/g, '<br />');
    return str;
  };
})();


/*
 * TypeCheck
 * @namespace caro
 * @author Caro.Huang
 */
(function() {
  var self;
  self = caro;

  /*
   * check if arg is boolean | string | number
   * @param {...} arg
   * @returns {boolean}
   */
  self.isBasicVal = function(arg) {
    return caro.checkIfPass(arguments, function(arg) {
      return !(!caro.isBoolean(arg) && !caro.isString(arg) && !caro.isNumber(arg));
    });
  };

  /*
   * check if value is empty ( {} | [] | null | '' | undefined )
   * @param {...} arg
   * @returns {boolean}
   */
  self.isEmptyVal = function(arg) {
    return caro.checkIfPass(arguments, function(arg) {
      if (caro.isNumber(arg) || caro.isBoolean(arg)) {
        return false;
      }
      return caro.size(arg) < 1;
    });
  };

  /*
   * check if value is true | 'true' | 1
   * @param {...} arg
   * @returns {boolean}
   */
  self.isEasingTrue = function(arg) {
    if (caro.isString(arg)) {
      arg = arg.toLowerCase();
    }
    return arg === true || arg === 'true' || arg === 1;
  };

  /*
   * check if value is false | 'false' | 0
   * @param arg
   * @returns {boolean}
   */
  self.isEasingFalse = function(arg) {
    if (caro.isString(arg)) {
      arg = arg.toLowerCase();
    }
    return arg === false || arg === 'false' || arg === 0;
  };

  /*
   * check if integer
   * @param {*} arg
   * @returns {boolean}
   */
  self.isInteger = function(arg) {
    var int;
    if (!caro.isNumber(arg)) {
      return false;
    }
    int = parseInt(arg);
    return int === arg;
  };

  /*
   * check if JSON, return false is one of them not match
   * @param {*} arg
   * @returns {boolean}
   */
  self.isJson = function(arg) {
    var e, error;
    try {
      JSON.parse(arg);
    } catch (error) {
      e = error;
      return false;
    }
    return true;
  };

  /*
   * check if argument is object-like JSON, return false is one of them not match
   * @param {...} arg
   * @returns {boolean}
   */
  self.isObjJson = function(arg) {
    var e, error, r;
    try {
      r = JSON.parse(arg);
      return caro.isObject(r);
    } catch (error) {
      e = error;
    }
    return false;
  };

  /*
   * check if string is uppercase
   * @param {...string} str
   * @returns {boolean}
   */
  self.isUpper = function(str) {
    var upp;
    upp = str.toUpperCase();
    if (upp !== str) {
      return false;
    }
    return true;
  };

  /*
   * check if string is lowercase
   * @param {string} str
   * @returns {boolean}
   */
  self.isLower = function(str) {
    var low;
    low = str.toLowerCase();
    if (low !== str) {
      return false;
    }
    return true;
  };
})();


/*
 * Helper
 * @namespace caro
 * @author Caro.Huang
 */
(function() {
  var self;
  self = caro;

  /*
   * cover to string
   * @param arg
   * @returns {*}
   */
  self.toString = function(arg) {
    return String(arg);
  };

  /*
   * cover to integer
   * @param arg
   * @returns {*}
   */
  self.toInteger = function(arg) {
    return parseInt(arg);
  };

  /*
   * cover to number
   * @param arg
   * @returns {*}
   */
  self.toNumber = function(arg) {
    return Number(arg);
  };

  /*
   * cover to fixed-number
   * @param arg
   * @param {boolean} [dec=2] decimal-number
   * @returns {*}
   */
  self.toFixedNumber = function(arg, dec) {
    var r;
    if (dec == null) {
      dec = 2;
    }
    r = caro.toString(arg);
    if (arg % 1) {
      r = r.replace(/5$/, '6');
    }
    return Number((+r).toFixed(dec));
  };

  /*
   * @param arg
   * @param {*} [replacer=null] the replace in each element
   * @param {*} [space=0] the space for easy-reading after cover to JSON
   * @returns {*}
   */
  self.toJson = function(arg, replacer, space) {
    return JSON.stringify.apply(null, arguments);
  };
})();
