// https://deno.land/std@0.141.0/testing#usage
import {
  assert,
  assertFalse,
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";

import { omljs, run, runAll } from "../omljs.mjs";

Deno.test("OBJECT_A", () => {
  var v1 = run(`
(ast2oml (list 11 22 33 ? (:key2 1.23) (:key1 true) (:key3 undefined]
  `);
  console.log(v1);
  assertEquals(v1, '( 11 22 33 ? (":key1" true) (":key2" 1.23) (":key3" undefined) )');
});

Deno.test("OBJECT_B", () => {
  var v1 = run(`
(ast2oml (list ? (:key2 1.23) (:key1 true) (:key3 undefined]
  `);
  console.log(v1);
  assertEquals(v1, '( ? (":key1" true) (":key2" 1.23) (":key3" undefined) )');
});

Deno.test("OBJECT_C", () => {
  var v1 = run(`
(ast2oml (? (:key2 1.23) (:key1 true) (:key3 undefined]
  `);
  console.log(v1);
  assertEquals(v1, '( ? (":key1" true) (":key2" 1.23) (":key3" undefined) )');
});

Deno.test("OBJECT_C", () => {
  var v1 = run(`
(ast2oml (? :key2 (:key1 true) (:key3 undefined]
  `);
  console.log(v1);
  assertEquals(v1, '( ? (":key1" true) (":key2" true) (":key3" undefined) )');
});

Deno.test("OBJECT_D", () => {
  var v1 = run(`
  (begin
    (define x (11 22 33 ? :key1 (:key2 "abc")))
    (case x
      [ (11 22 33 ? :key1 (:key2 "xyz"))
        (console.log "(case1)")
        1 ]
      [ (11 22 33 ? :key1 (:key2 "abc"))
        (console.log "(case2)")
        2 ]
      [ else
        (console.log "(case3)")
        3 ]
      ]
    `);
  console.log(v1);
  assertEquals(v1, 2);
});

Deno.test("OBJECT_E", () => {
  var v1 = run(`
  (begin
    (define x (11 22 33 ? :key1 (:key2 "abc")))
    (ast2oml x)
    ]
    `);
  console.log(v1);
  assertEquals(v1, '( 11 22 33 ? (":key1" true) (":key2" "abc") )');
});
