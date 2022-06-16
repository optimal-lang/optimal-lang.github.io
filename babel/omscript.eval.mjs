import * as common from "./omscript.common.mjs";

export function compile_ast(ast) {
    common.printAsJson(ast.type, "ast.type");
    common.printAsJson(ast, "ast");
    switch (ast.type) {
        case "FunctionDeclaration": {
            //common.printAsJson("FunctionDeclaration found");
            let text = "std::function<oml_root*(";
            text += Array(ast.params.length).fill("oml_root*").join(",");
            text += ")> ";
            text += ast.id.name + "=[&](";
            let params = [];
            for (let param of ast.params) {
                common.printAsJson(param.name, "FunctionDeclaration(param)");
                params.push("oml_root* " + param.name);
            }
            text += params.join(" ");
            text += "){";
            for (let step of ast.body.body) {
                common.printAsJson(step, "FunctionDeclaration(step)");
                step = compile_ast(step);
                common.printAsJson(step);
                text += step.text;
                text += ";";
            }
            text += "}";
            common.printAsJson(text);
            return { type: "?", text: text };
        } break;
        case "ReturnStatement": {
            let argument = compile_ast(ast.argument);
            let conv = function(x) { return x.type==="oml_root*" ? x.text : `new_root(${x.text})`; };
            return { type: "?", text: "return " + conv(argument) };
        } break;
        case "BinaryExpression": {
            common.printAsJson(ast.left, "BinaryExpression.left");
            common.printAsJson(ast.right, "BinaryExpression.right");
            let left = compile_ast(ast.left);
            let right = compile_ast(ast.right);
            let conv = function(x) { return x.type==="double" ? x.text : `number_value(${x.text})`; };
            common.printAsJson(left);
            common.printAsJson(right);
            return { type: "double", text: "(" + conv(left) + ast.operator + conv(right) + ")" };
        } break;
        case "Identifier": {
            //common.printAsJson(ast.name, "Identifier");
            return { type: "oml_root*", text: ast.name };
        } break;
        default:
            throw new Error(`AST node type "${ast.type}" is not expected.`)
            break;
    }
}