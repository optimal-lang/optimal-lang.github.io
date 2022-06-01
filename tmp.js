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
