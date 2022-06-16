import $parser from "https://jspm.dev/@babel/parser";
import $traverse from "https://jspm.dev/@babel/traverse";
import * as common from "./omscript.common.mjs";
import { compile_ast } from "./omscript.eval.mjs";
import { optimize } from "./optimize.mjs";


const code = `function square(n) {
  return n * n * n;
}
/*
let f = function (n) {
  return n * n * n;
}
*/
`;

let ast = $parser.parse(code);

let opt = optimize(ast);
//printAsJson(opt, "opt");

//printAsJson(opt.program.body, "opt.program.body");

for (let step of opt.program.body) {
  step = compile_ast(step);
  console.log(step.text + ";");
}

common.printAsJson(common.parsePath("C:\\abc\\xyz\\test.txt"));
common.printAsJson(common.parsePath("test2.txt"));
