import { TypescriptParser } from "./typescript.parser.mjs";

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

async function analyzePathAsync(path) {
  const $path = await import("https://jspm.dev/path");
  path = path.replace(/\\/g, "/");
  let result = $path.default.parse(path);
  result.path = result.dir + "/" + result.base;
  return result;
}

async function globAsync(pattern) {
  const $glob = await import("https://deno.land/std/fs/expand_glob.ts");
  return $glob.expandGlobSync(pattern);
}

//var ast = await TypescriptParser.parseFileAsync("transform.mjs", true);
//writeAsJson("ast.json", ast);
//console.log(Deno.readTextFileSync("ast.json"));

async function xchangeToQt_help(step, exportFlag) {
  if (exportFlag) printAsJson(exportFlag, "exportFlag");
  if (step.type != "ExportNamedDeclaration") printAsJson(step.type, "step.type");
  switch (step.type) {
    case "ExportNamedDeclaration":
      //printAsJson(step, "ExportNamedDeclaration");
      xchangeToQt_help(step.declaration, true);
      break;
    case "ImportDeclaration":
      //printAsJson(step, "ImportDeclaration");
      printAsJson(step.source.value, "step.source.value");
      let imported = await analyzePathAsync(step.source.value);
      printAsJson(imported.name, "imported.name");
      break;
    case "ClassDeclaration":
      printAsJson(step, "ClassDeclaration");
      printAsJson(step.declare, "  step.declare");
      printAsJson(step.id.name, "  step.id.name");
      printAsJson(step.superClass, "  step.superClass");
      printAsJson(step.body.body, "  step.body.body");
      for(let member of step.body.body) {
        printAsJson(member.type, "    member.type");
      }
      break;
    case "VariableDeclaration":
      //printAsJson(step.declarations, "step.declarations");
      printAsJson(step.declare, "  step.declare");
      printAsJson(step.kind, "  step.kind");
      for (let decl of step.declarations) {
        //printAsJson(decl, "  decl");
        printAsJson(decl.id.name, "  decl.id.name");
        printAsJson(decl.id.typeAnnotation.typeAnnotation.typeName.name,
          "  decl.id.typeAnnotation.typeAnnotation.typeName.name");
      }
      break;
    default:
  }
}

async function xchangeToQt(ast) {
  let errors = ast.errors;
  console.log(errors);
  printAsJson(ast.program.body);
  for (let step of ast.program.body) {
    await xchangeToQt_help(step);
    /*
    printAsJson(step.type, "step.type");
    switch (step.type) {
      case "ImportDeclaration":
        //printAsJson(step, "ImportDeclaration");
        printAsJson(step.source.value, "step.source.value");
        let imported = await analyzePathAsync(step.source.value);
        printAsJson(imported.name, "imported.name");
        break;
      case "ClassDeclaration":
        printAsJson(step, "ClassDeclaration");
        printAsJson(step.declare, "  step.declare");
        printAsJson(step.id.name, "  step.id.name");
        break;
      case "VariableDeclaration":
        //printAsJson(step.declarations, "step.declarations");
        printAsJson(step.declare, "  step.declare");
        printAsJson(step.kind, "  step.kind");
        for (let decl of step.declarations) {
          //printAsJson(decl, "  decl");
          printAsJson(decl.id.name, "  decl.id.name");
          printAsJson(decl.id.typeAnnotation.typeAnnotation.typeName.name,
            "  decl.id.typeAnnotation.typeAnnotation.typeName.name");
        }
        break;
      default:
    }
    */
  }
}

for (const entry of await globAsync("./src/**/*.*ts")) {
  var file = await analyzePathAsync(entry.path);
  if (file.name.startsWith("xchange.")) continue;
  console.log(file);
  console.log(file.name + " & " + file.ext);
  var ast = await TypescriptParser.parseFileAsync(file.path, true);
  console.log(JSON.stringify(ast, null, "  "));
  writeAsJson(file.path + ".ast.json", ast);
  await xchangeToQt(ast);
}
console.log("EOF");
