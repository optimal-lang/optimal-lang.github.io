import $parser from "https://jspm.dev/@babel/parser";
import $traverse from "https://jspm.dev/@babel/traverse";
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

const code = `function square(n) {
  return n * n * n;
}`;

let ast = $parser.parse(code);

let opt = optimize(ast);
printAsJson(opt, "opt");

printAsJson(opt.program.body, "opt.program.body");

for (let step of ast.program.body) {
	printAsJson(step.type);
}

