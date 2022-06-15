import $parser from "https://jspm.dev/@babel/parser";
import $traverse from "https://jspm.dev/@babel/traverse";
import $path from "https://jspm.dev/path";

import { optimize } from "./optimize.mjs";

function printAsJson(x, title) {
  let json = JSON.stringify(x, null, "  ");
  if (title == null)
    console.log(json);
  else
    console.log(title + ": " + json);
}

function writeAsJson(path, x) {
  Deno.writeTextFileSync(
    path,
    JSON.stringify(x, null, "  ")
  );
}

function parsePath(path) {
  path = path.replace(/\\/g, "/");
  let result = $path.parse(path);
  //result.path = result.dir + "/" + result.base;
  return result;
}



const code = `function square(n) {
  return n * n * n;
}`;

let ast = $parser.parse(code);

let opt = optimize(ast);
//printAsJson(opt, "opt");

//printAsJson(opt.program.body, "opt.program.body");

for (let step of opt.program.body) {
	printAsJson(step.type, "step.type");
	printAsJson(step, "step");
}

printAsJson(parsePath("C:\\abc\\xyz\\test.txt"));
printAsJson(parsePath("test2.txt"));
