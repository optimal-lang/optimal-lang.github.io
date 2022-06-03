import { omlcpp } from "./omlcpp.mjs";

let code = Deno.readTextFileSync("code.txt");

var om2 = omlcpp();
var v2 = om2.compile(code, true);
Deno.writeTextFileSync("tmp.cpp", v2);
