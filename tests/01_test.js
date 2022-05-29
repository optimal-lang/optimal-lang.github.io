// https://deno.land/std@0.141.0/testing#usage
import {
  assert,
  assertFalse,
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";

import { optiMAL } from "../optiMAL2.mjs";

Deno.test("01A", () => {
  var glob = optiMAL(window);
  var v1 = glob.runAll(`(+ 11 22]`);
  console.log(v1);
  assert(v1 == 33);
});

Deno.test("01B", () => {
  var glob = optiMAL(window);
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
  var glob = optiMAL(window);
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
  var glob = optiMAL(window);
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
  var glob = optiMAL(window);
  var v1 = glob.runAll(`
    (define list '())
    (dotimes '3
      @list.push(index)@
      )
    list
  `);
  console.log(v1);
  assertEquals(v1, [0,1,2]);
});

Deno.test("01E", () => {
  var glob = optiMAL(window);
  var v1 = glob.runAll(`
    (define list '())
    (dotimes 3
      @list.push(index)@
      )
    list
  `);
  console.log(v1);
  assertEquals(v1, [0,1,2]);
});

Deno.test("01F", () => {
  var glob = optiMAL(window);
  var v1 = glob.runAll(`
    (define list '())
    (dotimes (i 3)
      @list.push(i)@
      )
    list
  `);
  console.log(v1);
  assertEquals(v1, [0,1,2]);
});

Deno.test("01G", () => {
  var glob = optiMAL(window);
  var v1 = glob.runAll(`
    (try 123
      (catch ex (+ 1 ex]
  `);
  console.log(v1);
  assertEquals(v1, 123);
});

Deno.test("01H", () => {
  var glob = optiMAL(window);
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
      var glob = optiMAL(window);
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
    var glob = optiMAL(window);
    v1 = glob.runAll(`
      (throw 123)
    `);
  } catch(ex) {
    v1 = ex + 1
  }
  console.log(v1);
  assertEquals(v1, 124);
});

Deno.test("01K", () => {
  var glob = optiMAL(window);
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
  var glob = optiMAL(window);
  var v1 = glob.runAll(`
    (define list '())
    (dotimes (i 3 @list@)
      @list.push(i)@
      )
  `);
  console.log(v1);
  assertEquals(v1, [0,1,2]);
});
