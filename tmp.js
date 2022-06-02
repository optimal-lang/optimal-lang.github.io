globalThis.add2 = function (a, b) {
  return (((function (__number__) {
    __number__ = a;
    return (typeof __number__ !== "number" ? 0 : (__number__));
  })()) + ((function (__number__) {
    __number__ = b;
    return (typeof __number__ !== "number" ? 0 : (__number__));
  })()));
};
console.log(add2(11, 22));
console.log(
  5 * ((function (__number__) {
    __number__ = 2 + 3;
    return (typeof __number__ !== "number" ? 0 : (__number__));
  })()) * 10,
);
globalThis.x = add2(100, 23);
globalThis.add_x = function (n) {
  return (((function (__number__) {
    __number__ = n;
    return (typeof __number__ !== "number" ? 0 : (__number__));
  })()) + ((function (__number__) {
    __number__ = x;
    return (typeof __number__ !== "number" ? 0 : (__number__));
  })()));
};
console.log(add_x(10));
console.log((function (x, y) {
  return (((function (__number__) {
    __number__ = x;
    return (typeof __number__ !== "number" ? 0 : (__number__));
  })()) + ((function (__number__) {
    __number__ = y;
    return (typeof __number__ !== "number" ? 0 : (__number__));
  })()));
})(11, 22));
console.log((function (x, y) {
  x = 11;
  y = 22;
  return (((function (__number__) {
    __number__ = x;
    return (typeof __number__ !== "number" ? 0 : (__number__));
  })()) + ((function (__number__) {
    __number__ = y;
    return (typeof __number__ !== "number" ? 0 : (__number__));
  })()));
})());
globalThis.fact = function (x) {
  return ((function (n, rlt) {
    n = 2;
    rlt = 1;
    return (((function () {
      while (
        !(((function (__number__) {
          __number__ = x;
          return (typeof __number__ !== "number" ? 0 : (__number__));
        })()) < ((function (__number__) {
          __number__ = n;
          return (typeof __number__ !== "number" ? 0 : (__number__));
        })()))
      ) {
        (rlt = ((function (__number__) {
          __number__ = rlt;
          return (typeof __number__ !== "number" ? 0 : (__number__));
        })()) * ((function (__number__) {
          __number__ = n;
          return (typeof __number__ !== "number" ? 0 : (__number__));
        })()),
          n = 1 + ((function (__number__) {
            __number__ = n;
            return (typeof __number__ !== "number" ? 0 : (__number__));
          })()));
      }
    })(),
      null),
      rlt);
  })());
};
console.log(fact(4));
globalThis.fact2 = function (x) {
  return ((function (__do__, n, rlt) {
    return (((function () {
      while (
        !(((function (__number__) {
          __number__ = x;
          return (typeof __number__ !== "number" ? 0 : (__number__));
        })()) < ((function (__number__) {
          __number__ = n;
          return (typeof __number__ !== "number" ? 0 : (__number__));
        })()))
      ) {
        (rlt = ((function (__number__) {
          __number__ = rlt;
          return (typeof __number__ !== "number" ? 0 : (__number__));
        })()) * ((function (__number__) {
          __number__ = n;
          return (typeof __number__ !== "number" ? 0 : (__number__));
        })()),
          __do__[0] = 1 + ((function (__number__) {
            __number__ = n;
            return (typeof __number__ !== "number" ? 0 : (__number__));
          })()),
          n = __do__[0]);
      }
    })(),
      null),
      rlt);
  })(new Array(2).fill(null), 2, 1));
};
console.log(fact2(4));
globalThis.dummy1 = function () {
  return ((function (a) {
    return ((function (b) {
      return (console.log(
        ((function (__number__) {
          __number__ = a;
          return (typeof __number__ !== "number" ? 0 : (__number__));
        })()) + ((function (__number__) {
          __number__ = b;
          return (typeof __number__ !== "number" ? 0 : (__number__));
        })()),
      ));
    })(33));
  })(22));
};
dummy1();
globalThis.dummy2 = function () {
  return ((function (my_add2) {
    return (console.log(my_add2(33, 44)));
  })(function (a, b) {
    return (((function (__number__) {
      __number__ = a;
      return (typeof __number__ !== "number" ? 0 : (__number__));
    })()) + ((function (__number__) {
      __number__ = b;
      return (typeof __number__ !== "number" ? 0 : (__number__));
    })()));
  }));
};
dummy2();
console.log(2 * 3);
console.log(
  2 + ((function (__number__) {
    __number__ = null;
    return (typeof __number__ !== "number" ? 0 : (__number__));
  })()) + ((function (__number__) {
    __number__ = undefined;
    return (typeof __number__ !== "number" ? 0 : (__number__));
  })()) + 3,
);
