import { optimize } from "./optimize.mjs";

export class TypescriptParser {
  static async parseAsync(code, optimizeFlag) {
    //import $parser from "https://jspm.dev/@babel/parser";
    let $parser = await import("https://jspm.dev/@babel/parser");
    var ast = $parser.default.parse(code, {
      sourceType: "module",
      plugins: ["typescript"],
    });
    if (optimizeFlag) ast = optimize(ast);
    return ast;
  }
  static async parseFileAsync(path, optimizeFlag) {
    var code = Deno.readTextFileSync(path);
    var ast = await this.parseAsync(code, optimizeFlag);
    return ast;
  }
}
