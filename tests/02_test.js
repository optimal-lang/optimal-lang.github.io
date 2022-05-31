// https://deno.land/std@0.141.0/testing#usage
import {
  assert,
  assertFalse,
  assertEquals,
  assertThrows,
} from "https://deno.land/std/testing/asserts.ts";

import { optiMAL, run, runAll } from "../optiMAL2.mjs";

Deno.test("02A", () => {
  var v1 = run(`
    (define x 11)
    (defvar y 22)
    (def z 33)
    (+ x y z)
  `);
  console.log(v1);
  assertEquals(v1, 66);
});

Deno.test("02B", () => {
  var v1 = run(`
    (begin)
    `);
  console.log(v1);
  assertEquals(v1, null);
});

Deno.test("02C", () => {
  var v1 = run(`
    (begin
      (define x 11)
      )
    `);
  console.log(v1);
  assertEquals(v1, null);
});

Deno.test("02D", () => {
  var v1 = run(`
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
  var v1 = run(`
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
      var v1 = run(`
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

Deno.test("02G", () => {
  assertThrows(
    () => {
      var v1 = run(`
        (define x (+ 1 not_exist]
        (console.log x)
        x
        `);
    },
    ReferenceError,
    "not_exist is not defined",
  );
});

Deno.test("02H", () => {
  assertThrows(
    () => {
      var v1 = run(`
        (if (define x 1) 10 20)
        `);
    },
    Error,
    "def is not allowed here",
  );
});

Deno.test("02I", () => {
  assertThrows(
    () => {
      var v1 = run(`
        (cond ((define x 1) 10) (else 20]
        `);
    },
    Error,
    "def is not allowed here",
  );
});

Deno.test("02J", () => {
  assertThrows(
    () => {
      var v1 = run(`
        (throw (define x 1))
        `);
    },
    Error,
    "def is not allowed here",
  );
});

Deno.test("02K", () => {
  assertThrows(
    () => {
      var v1 = run(`
        (try (define x 1) (catch e))
        `);
    },
    Error,
    "def is not allowed here",
  );
});

Deno.test("02K", () => {
  assertThrows(
    () => {
      var v1 = run(`
        (while (define x 1) true)
        `);
    },
    Error,
    "def is not allowed here",
  );
});

Deno.test("02L", () => {
  assertThrows(
    () => {
      var v1 = run(`
        (until (define x 1) true)
        `);
    },
    Error,
    "def is not allowed here",
  );
});

Deno.test("02M", () => {
  var v1 = run(`
    (defun f (n)
      (cond
        [(< n 0) (console.log "minus") "minus"]
        [(== n 0) (console.log "zero") "zero"]
        [else (console.log "plus") "plus"]
        )
      )
    (list (f -1) (f 0) (f 1]
    `);
  console.log(v1);
  assertEquals(v1, ["minus","zero","plus"]);
});
