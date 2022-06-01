import { omljs } from "./omljs.mjs";

var om = omljs();
var v1 = om.compile(`
(defun add2 (a b) (+ a b]
(console.log (add2 11 22]
(console.log (* 5 (+ 2 3) 10]
`, true);
console.log(v1);
Deno.writeTextFileSync("tmp.js", v1);
