import $parser from "https://jspm.dev/@babel/parser";
import $traverse from "https://jspm.dev/@babel/traverse";
import * as common from "./omscript.common.mjs";
import { compile_ast } from "./omscript.eval.cpp.mjs";
import { optimize } from "./optimize.mjs";

const CPP_HEAD =
    `#include "omlcpp.h"

int main() {
    GC_INIT();
    static oml_root *null = new_null();
    static oml_root *undefined = new_undefined();
`;

const CPP_TAIL =
    `
    return 0;
}
`

let code = Deno.readTextFileSync("code.js");

let ast = $parser.parse(code);

let opt = optimize(ast);
//printAsJson(opt, "opt");

//printAsJson(opt.program.body, "opt.program.body");
let text = CPP_HEAD;

for (let step of opt.program.body) {
  step = compile_ast(step);
  console.log(step.text + ";");
  text += step.text + ";\n";
}

text += CPP_TAIL;

common.printAsJson(common.parsePath("C:\\abc\\xyz\\test.txt"));
common.printAsJson(common.parsePath("test2.txt"));

console.log(text);
Deno.writeTextFileSync("tmp.cpp", text);
