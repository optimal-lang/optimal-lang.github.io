// https://deno.land/std@0.141.0/testing#usage
import {
  assert,
  assertFalse,
  assertEquals,
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
