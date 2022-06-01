import { omljs } from "./omljs.mjs";
import { omlcpp } from "./omlcpp.mjs";

const code = `
(defun add2 (a b) (+ a b]
(console.log (add2 11 22]
(console.log (* 5 (+ 2 3) 10]
(defvar x (add2 100 23]
(defun add_x (n) (+ n x]
(console.log (add_x 10]
(console.log (let [(x 11) (y 22)] (+ x y]]
(console.log (let* [(x 11) (y 22)] (+ x y]]
`;

var om = omljs();
var v1 = om.compile(code, true);
console.log(v1);
Deno.writeTextFileSync("tmp.js", v1);

var om2 = omlcpp();
var v2 = om2.compile(code, true);
console.log(v2);
Deno.writeTextFileSync("tmp.cpp", v2);
