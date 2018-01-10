'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var L = require('partial.lenses');
var I = require('infestines');

var header = 'partial.lenses.validation: ';
function error(msg) {
  throw Error(header + msg);
}

var isNull = function isNull(x) {
  return x === null;
};

var defaultsArray = /*#__PURE__*/L.defaults([]);
var requiredNull = /*#__PURE__*/L.required(null);

var removeIfAllNull = /*#__PURE__*/L.rewrite(function (xs) {
  return L.all(isNull, L.elems, xs) ? undefined : xs;
});

var accept = L.removeOp;
var reject = L.setOp;

var rejectArray = /*#__PURE__*/reject([]);

var emptyToUndefined = function emptyToUndefined(x) {
  return I.acyclicEqualsU(x, I.object0) ? undefined : x;
};

var objectWith = /*#__PURE__*/I.curry(function (onOthers, propsToKeep, template) {
  onOthers = L.toFunction(onOthers);
  var op = {};
  var n = propsToKeep && propsToKeep.length;
  for (var i = 0; i < n; ++i) {
    op[propsToKeep[i]] = L.zero;
  }for (var k in template) {
    op[k] = L.toFunction(template[k]);
  }var min = {};
  for (var _k in template) {
    min[_k] = undefined;
  }return L.toFunction([function (x, i, C, xi2yC) {
    return C.map(emptyToUndefined, xi2yC(I.assign({}, min, x, i)));
  }, L.values, function (x, i, C, xi2yC) {
    return (op[i] || onOthers)(x, i, C, xi2yC);
  }]);
});

var object = /*#__PURE__*/objectWith(accept);

var arrayIxOr = /*#__PURE__*/I.curry(function (onOther, rules) {
  return L.ifElse(I.isArray, [removeIfAllNull, L.elems, requiredNull, rules], onOther);
});

var arrayIx = /*#__PURE__*/arrayIxOr(rejectArray);

var arrayIdOr = /*#__PURE__*/I.curry(function (onOther, rules) {
  return L.ifElse(I.isArray, [defaultsArray, L.elems, rules], onOther);
});

var arrayId = /*#__PURE__*/arrayIdOr(rejectArray);

var pargs = function pargs(name, fn) {
  return (process.env.NODE_ENV === 'production' ? I.id : function (fn) {
    return function () {
      for (var i = 0, n = arguments.length; i < n; ++i) {
        var c = arguments[i];
        if (!I.isArray(c) || c.length !== 2) error(name + ' must be given pairs arguments.');
      }
      return fn.apply(null, arguments);
    };
  })(function () {
    var r = accept;
    var n = arguments.length;
    while (n) {
      var c = arguments[--n];
      r = fn(c[0], c[1], r);
    }
    return r;
  });
};

var cases = /*#__PURE__*/pargs('cases', L.ifElse);
var unless = /*#__PURE__*/pargs('unless', function (c, a, r) {
  return L.ifElse(c, r, reject(a));
});

var optional$1 = function optional$$1(rules) {
  return L.toFunction([L.optional, rules]);
};

var validate = L.transform;

exports.accept = accept;
exports.reject = reject;
exports.objectWith = objectWith;
exports.object = object;
exports.arrayIxOr = arrayIxOr;
exports.arrayIx = arrayIx;
exports.arrayIdOr = arrayIdOr;
exports.arrayId = arrayId;
exports.cases = cases;
exports.unless = unless;
exports.optional = optional$1;
exports.validate = validate;
exports.choose = L.choose;
