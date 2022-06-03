import { omljs } from "./omljs.mjs";

let code = Deno.readTextFileSync("code.txt");

var om = omljs();
var v1 = om.exec(code);
