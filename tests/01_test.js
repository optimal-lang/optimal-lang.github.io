// https://deno.land/std@0.141.0/testing#usage
import {
  assert,
  assertFalse,
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";

import { oml } from "../oml.mjs";

Deno.test("01A", () => {
  var glob = oml();
  var v1 = glob.runAll(`(+ 11 22]`);
  console.log(v1);
  assert(v1 == 33);
});

Deno.test("01B", () => {
  var glob = oml();
  var v1 = glob.runAll(`
    (define x 123)
    (begin
      (set! x (+ 1 x))
      (set! x (+ 2 x))
      x)
  `);
  console.log(v1);
  assert(v1 == 126);
});

Deno.test("01B", () => {
  var glob = oml();
  var v1 = glob.runAll(`
    (define x 123)
    (cond
      [ (== x -1)
        (console.log "(case1)")
        1 ]
      [ :else
        (console.log "(case2)")
        2 ]
    ]
  `);
  console.log(v1);
  assert(v1 == 2);
});

Deno.test("01C", () => {
  var glob = oml();
  var v1 = glob.runAll(`
    (define x 123)
    (case x
      [ -1
        (console.log "(case1)")
        1 ]
      [ :else
        (console.log "(case2)")
        2 ]
    ]
  `);
  console.log(v1);
  assert(v1 == 2);
});

Deno.test("01D", () => {
  var glob = oml();
  var v1 = glob.runAll(`
    (define list '())
    (dotimes '3
      @list.push($index)@
      )
    list
  `);
  console.log(v1);
  assertEquals(v1, [0, 1, 2]);
});

Deno.test("01E", () => {
  var glob = oml();
  var v1 = glob.runAll(`
    (define list '())
    (dotimes 3
      @list.push($index)@
      )
    list
  `);
  console.log(v1);
  assertEquals(v1, [0, 1, 2]);
});

Deno.test("01F", () => {
  var glob = oml();
  var v1 = glob.runAll(`
    (define list '())
    (dotimes (i 3)
      @list.push(i)@
      )
    list
  `);
  console.log(v1);
  assertEquals(v1, [0, 1, 2]);
});

Deno.test("01G", () => {
  var glob = oml();
  var v1 = glob.runAll(`
    (try 123
      (catch ex (+ 1 ex]
  `);
  console.log(v1);
  assertEquals(v1, 123);
});

Deno.test("01H", () => {
  var glob = oml();
  var v1 = glob.runAll(`
    (try (throw 123)
      (catch ex (+ 1 ex]
  `);
  console.log(v1);
  assertEquals(v1, 124);
});

Deno.test("01I", () => {
  assertThrows(
    () => {
      var glob = oml();
      var v1 = glob.runAll(`
        (try (throw 123)
          (catch ex (let ((msg "Panic!")) (throw @new Error(msg)@]
      `);
    },
    Error,
    "Panic!",
  );
});

Deno.test("01J", () => {
  var v1;
  try {
    var glob = oml();
    v1 = glob.runAll(`
      (throw 123)
    `);
  } catch (ex) {
    v1 = ex + 1
  }
  console.log(v1);
  assertEquals(v1, 124);
});

Deno.test("01K", () => {
  var glob = oml();
  var v1 = glob.runAll(`
    (define (fact x)
      (do ((n 2 (+ 1 n)) (result 1))
          ((< x n) result)
        (set! result (* result n))))
    (console.log (fact 4))
    (fact 4)
  `);
  console.log(v1);
  assertEquals(v1, 24);
});

Deno.test("01L", () => {
  var glob = oml();
  var v1 = glob.runAll(`
    (define list '())
    (dotimes (i 3 @list@)
      @list.push(i)@
      )
  `);
  console.log(v1);
  assertEquals(v1, [0, 1, 2]);
});

Deno.test("01M", () => {
  var glob = oml();
  var v1 = glob.runAll(`
    (define list '(1 2 3))
    (length list)
  `);
  console.log(v1);
  assertEquals(v1, 3);
});

Deno.test("01N", () => {
  var glob = oml();
  var v1 = glob.runAll(`
    (define list '(1 2 3))
    (prop-get list 2)
  `);
  console.log(v1);
  assertEquals(v1, 3);
});

Deno.test("01O", () => {
  var glob = oml();
  var v1 = glob.runAll(`
    (define list '(1 2 3))
    (define result '())
    (dolist (i list result)
      @result.push(i * 10)@
      )
  `);
  console.log(v1);
  assertEquals(v1, [10, 20, 30]);
});

Deno.test("01P", () => {
  var glob = oml();
  var v1 = glob.runAll(`
    (defun fact (x)
      (do* ((n 2 (+ 1 n)) (result 1))
           ((< x n) result)
        (set! result (* result n))))
    (defvar n 4)
    (console.log (fact n))
    (fact 4)
  `);
  console.log(v1);
  assertEquals(v1, 24);
});

Deno.test("01Q", () => {
  var glob = oml();
  var v1 = glob.runAll(`
    (define list '())
    (dotimes (i 3 list)
      (prop-set! list i (* i 100]
  `);
  console.log(v1);
  assertEquals(v1, [0, 100, 200]);
});

Deno.test("01R", () => {
  var glob = oml();
  var v1 = glob.runAll(`
    (define dict (dict a 123]
    (prop-get dict "a")
  `);
  console.log(v1);
  assertEquals(v1, 123);
});

Deno.test("01S", () => {
  var glob = oml();
  var v1 = glob.runAll(`
    (define dict @{}@)
    (dotimes (i 3 dict)
      (prop-set! dict @"a"+i@ (* i 100]
  `);
  console.log(v1);
  assertEquals(v1, {a0:0,a1:100,a2:200});
});

Deno.test("01T", () => {
  var glob = oml();
  var v1 = glob.runAll(`
    (define list '(1 2 3))
    (define result '())
    (dolist list
      @result.push($item * 10)@
      )
    result
  `);
  console.log(v1);
  assertEquals(v1, [10, 20, 30]);
});

Deno.test("01U", () => {
  var glob = oml();
  var v1 = glob.runAll(`
    (let ([add2 (fn (a b) (+ a b])
    (add2 11 22)
  `);
  console.log(v1);
  assertEquals(v1, 33);
});

Deno.test("01V", () => {
  var glob = oml();
  var v1 = glob.runAll(`
    (let ([add2 (lambda (a b) (+ a b])
    (add2 11 22)
  `);
  console.log(v1);
  assertEquals(v1, 33);
});

Deno.test("01W", () => {
  var glob = oml();
  var v1 = glob.runAll(`
    (let ([add2 (lambda (a b) (+ a b])
    ((prop-get console "log") (add2 11 22))
    (add2 11 22)
  `);
  console["log"](v1);
  assertEquals(v1, 33);
});
