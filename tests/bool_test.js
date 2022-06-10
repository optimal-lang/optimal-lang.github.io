// https://deno.land/std@0.141.0/testing#usage
import {
  assert,
  assertFalse,
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";

import { omljs, run, runAll } from "../omljs.mjs";

Deno.test("BOOL_A", () => {
  var v1 = run(`
(if true "ok" "ng")
  `);
  console.log(v1);
  assertEquals(v1, "ok");
});

Deno.test("BOOL_B", () => {
  var v1 = run(`
(if false "ok" "ng")
  `);
  console.log(v1);
  assertEquals(v1, "ng");
});

Deno.test("BOOL_C", () => {
  var v1 = run(`
(if "abc" "ok" "ng")
  `);
  console.log(v1);
  assertEquals(v1, "ok");
});

Deno.test("BOOL_D", () => {
  var v1 = run(`
(if "" "ok" "ng")
  `);
  console.log(v1);
  assertEquals(v1, "ng");
});

Deno.test("BOOL_E", () => {
  var v1 = run(`
(if [1 2 3] "ok" "ng")
  `);
  console.log(v1);
  assertEquals(v1, "ok");
});

Deno.test("BOOL_F", () => {
  var v1 = run(`
(if [] "ok" "ng")
  `);
  console.log(v1);
  assertEquals(v1, "ok");
});
