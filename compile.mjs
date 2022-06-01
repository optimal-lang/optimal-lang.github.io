import { omljs } from "./omljs.mjs";
import { omlcpp } from "./omlcpp.mjs";

var om = omljs();
var v1 = om.compile(`
(defun add2 (a b) (+ a b]
(console.log (add2 11 22]
(console.log (* 5 (+ 2 3) 10]
`, true);
console.log(v1);
Deno.writeTextFileSync("tmp.js", v1);

var om2 = omlcpp();
var v2 = om2.compile(`
(defun add2 (a b) (+ a b]
(console.log (add2 11 22]
(console.log (* 5 (+ 2 3) 10]
`, true);
console.log(v2);
Deno.writeTextFileSync("tmp.cpp", v2);
