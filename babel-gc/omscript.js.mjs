import { oml2ast, ast2oml, astequal } from "./oml2ast.mjs";
import { OMLCommon } from "./omlcommon.mjs";

function print(x) {
    console.log(ast2oml(x));
    return x;
};
//globalThis.print = print;

function number_value(x) {
    return typeof x !== "number" ? 0 : x;
}
//globalThis.number_value = number_value;

let code = Deno.readTextFileSync("code.js");

eval(code);
