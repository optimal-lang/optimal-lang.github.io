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

Deno.test("02B", () => {
  var glob = optiMAL(window);
  var v1 = glob.runAll(`
    (begin)
    `);
  console.log(v1);
  assertEquals(v1, null);
});

Deno.test("02C", () => {
  var glob = optiMAL(window);
  var v1 = glob.runAll(`
    (begin
      (define x 11)
      )
    `);
  console.log(v1);
  assertEquals(v1, null);
});

Deno.test("02D", () => {
  var glob = optiMAL(window);
  var v1 = glob.runAll(`
    (begin
      (define x 11)
      (defvar y 22)
      (def z 33)
      (+ x y z)
      )
    `);
  console.log(v1);
  assertEquals(v1, 66);
});

Deno.test("02E", () => {
  var glob = optiMAL(window);
  var v1 = glob.runAll(`
    (define list '(10 20 30]
    (begin
      (define x (length list))
      (defvar list (prop-get list 1))
      (list x list)
      )
    `);
  console.log(v1);
  assertEquals(v1, [3, 20]);
});

Deno.test("02F", () => {
  assertThrows(
    () => {
      var glob = optiMAL(window);
      var v1 = glob.runAll(`
        (define list '(10 20 30]
        (let* [
          (x (length list))
          (list (prop-get list 1))
          ]
          (list x list)
          )
        `);
    },
    TypeError,
    "Cannot read properties of undefined (reading 'length')",
  );
});
