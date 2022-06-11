// https://deno.land/std@0.141.0/testing#usage
import {
  assert,
  assertFalse,
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";

import { omljs, run, runAll } from "../omljs.mjs";

Deno.test("EQUAL_A", () => {
  var v1 = run(`
(equal true false)
  `);
  console.log(v1);
  assertEquals(v1, false);
});

Deno.test("EQUAL_B", () => {
  var v1 = run(`
(equal ("a" 1.5 undefined) ("a" 1.5 undefined))
  `);
  console.log(v1);
  assertEquals(v1, true);
});

Deno.test("EQUAL_C", () => {
  var v1 = run(`
(equal ("a" 1.5 undefined) ("a" 1.5 null))
  `);
  console.log(v1);
  assertEquals(v1, false);
});
