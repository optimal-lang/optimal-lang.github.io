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
(ast2oml (object 11 22 33 & (:key2 1.23) (:key1 true) (:key3 undefined]
  `);
  console.log(v1);
  assertEquals(v1, '( 11 22 33 & (":key1" true) (":key2" 1.23) (":key3" undefined) )');
});

Deno.test("OBJECT_B", () => {
  var v1 = run(`
(ast2oml (object & (:key2 1.23) (:key1 true) (:key3 undefined]
  `);
  console.log(v1);
  assertEquals(v1, '( & (":key1" true) (":key2" 1.23) (":key3" undefined) )');
});
