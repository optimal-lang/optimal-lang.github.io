import * as common from "./omscript.common.mjs";

export function compile_ast(ast) {
    common.printAsJson(ast.type, "ast.type");
    common.printAsJson(ast, "ast");
    switch (ast.type) {
        case "FunctionExpression": {
            let text = "";
            text += "[&](";
            let params = [];
            for (let param of ast.params) {
                common.printAsJson(param.name, "FunctionDeclaration(param)");
                params.push("om_register* " + param.name);
            }
            text += params.join(",");
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
            return { type: ast.type, text: text };
        } break;
        case "FunctionDeclaration": {
            /*
            let text = "std::function<om_register*(";
            text += Array(ast.params.length).fill("om_register*").join(",");
            text += ")> ";
            */
            let text = "";
            text += "auto " + ast.id.name + "="
            text += "[&](";
            let params = [];
            for (let param of ast.params) {
                common.printAsJson(param.name, "FunctionDeclaration(param)");
                params.push("om_register* " + param.name);
            }
            text += params.join(",");
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
            return { type: ast.type, text: text };
        } break;
        case "ReturnStatement": {
            let argument = compile_ast(ast.argument);
            let conv = function(x) { return x.type==="om_register*" ? x.text : `new_register(${x.text})`; };
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
            return { type: "om_register*", text: ast.name };
        } break;
        case "ExpressionStatement": {
            return compile_ast(ast.expression);
        } break;
        case "CallExpression": {
            //common.printAsJson("FunctionDeclaration found");
            let text = ast.callee.name + "(";
            let args = [];
            for (let arg of ast.arguments) {
                arg = compile_ast(arg);
                let conv = function(x) { return x.type==="om_register*" ? x.text : `new_register(${x.text})`; };
                args.push(conv(arg));
            }
            text += args.join(",");
            text += ")";
            return { type: "om_register*", text: text };
        } break;
        case "NumericLiteral": {
            return {type: "double", text: `(double)${ast.extra.raw}` };
        } break;
        case "VariableDeclaration": {
            let declarations = ast.declarations;
            if (declarations.length !== 1) throw new Error("VariableDeclaration error(1)");
            let declaration = declarations[0];
            common.printAsJson(declaration.id.name);
            common.printAsJson(declaration.init);
            let text = "auto " + declaration.id.name + "=";
            let init = compile_ast(declaration.init);
            let conv = function(x) { return x.type==="om_register*"||x.type==="FunctionExpression" ? x.text : `new_register(${x.text})`; };
            text += conv(init);
            return {type: "om_register*", text: text };
        } break;
        default:
            throw new Error(`AST node type "${ast.type}" is not expected.`)
            break;
    }
}