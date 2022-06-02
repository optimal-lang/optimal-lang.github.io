globalThis.add2 = function (a, b) {
  return (a + b);
};
console.log(add2(11, 22));
console.log(5 * (2 + 3) * 10);
globalThis.x = add2(100, 23);
globalThis.add_x = function (n) {
  return (n + x);
};
console.log(add_x(10));
console.log((function (x, y) {
  return (x + y);
})(11, 22));
console.log((function (x, y) {
  x = 11;
  y = 22;
  return (x + y);
})());
globalThis.fact = function (x) {
  return ((function (n, rlt) {
    n = 2;
    rlt = 1;
    return (((function () {
      while (!(x < n)) (rlt = rlt * n, n = 1 + n);
    })(),
      null),
      rlt);
  })());
};
console.log(fact(4));
globalThis.fact2 = function (x) {
  return ((function (__do__, n, rlt) {
    return (((function () {
      while (!(x < n)) (rlt = rlt * n, __do__[0] = 1 + n, n = __do__[0]);
    })(),
      null),
      rlt);
  })(new Array(2).fill(null), 2, 1));
};
console.log(fact2(4));
globalThis.dummy1 = function () {
  return ((function (a) {
    return ((function (b) {
      return (console.log(a + b));
    })(33));
  })(22));
};
dummy1();
globalThis.dummy2 = function () {
  return ((function (my_add2) {
    return (console.log(my_add2(33, 44)));
  })(function (a, b) {
    return (a + b);
  }));
};
dummy2();
console.log(2 * 3);
