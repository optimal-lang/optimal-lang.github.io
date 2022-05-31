// https://deno.land/std@0.141.0/testing#usage
import {
  assert,
  assertFalse,
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";

import { optiMAL } from "../optiMAL2.mjs";

Deno.test("02A", () => {
  var glob = optiMAL(window);
  var v1 = glob.runAll(`
    (define x 11)
    (defvar y 22)
    (def z 33)
    (+ x y z)
  `);
  console.log(v1);
  assertEquals(v1, 66);
});
