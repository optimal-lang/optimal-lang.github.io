import $parser from "https://jspm.dev/@babel/parser";
import $traverse from "https://jspm.dev/@babel/traverse";
import { optimize } from "./optimize.mjs";

const code = `function square(n) {
  return n * n * n;
}`;

let ast = $parser.parse(code);

$traverse.default(ast, {
  enter(path) {
    if (path.isIdentifier({ name: "n" })) {
      path.node.name = "x";
    }
  },
});

$traverse.default(ast, {
  FunctionDeclaration: function(path) {
    path.node.id.name = "x";
  },
});

ast = optimize(ast);
console.log(JSON.stringify(ast, null, "  "));
