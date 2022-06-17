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
                text += step;
                text += ";";
            }
            text += "}";
            common.printAsJson(text);
            return text;
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
                text += step;
                text += ";";
            }
            text += "}";
            common.printAsJson(text);
            return text;
        } break;
        case "ReturnStatement": {
            let argument = compile_ast(ast.argument);
            return "return " + argument;
        } break;
        case "BinaryExpression": {
            common.printAsJson(ast.left, "BinaryExpression.left");
            common.printAsJson(ast.right, "BinaryExpression.right");
            let left = compile_ast(ast.left);
            let right = compile_ast(ast.right);
            common.printAsJson(left);
            common.printAsJson(right);
            return "(" + `(*(${left}))` + ast.operator + `(*(${right}))` + ")";
        } break;
        case "Identifier": {
            return ast.name;
        } break;
        case "ExpressionStatement": {
            return compile_ast(ast.expression);
        } break;
        case "CallExpression": {
            let text = ast.callee.name + "(";
            let args = [];
            for (let arg of ast.arguments) {
                arg = compile_ast(arg);
                //let conv = function(x) { return x.type==="om_register*" ? x.text : `new_register(${x.text})`; };
                args.push(arg);
            }
            text += args.join(",");
            text += ")";
            return text;
        } break;
        case "BooleanLiteral": {
            return `new_bool(${ast.value})`;
        } break;
        case "NumericLiteral": {
            return `new_number(${ast.extra.raw})`;
        } break;
        case "StringLiteral": {
            return `new_string(${ast.extra.raw})`;
        } break;
        case "NullLiteral": {
            return null;
        } break;
        case "VariableDeclaration": {
            let declarations = ast.declarations;
            if (declarations.length !== 1) throw new Error("VariableDeclaration error(1)");
            let declaration = declarations[0];
            common.printAsJson(declaration.id.name);
            common.printAsJson(declaration.init);
            let text = "auto " + declaration.id.name + "=";
            let init = compile_ast(declaration.init);
            //let conv = function(x) { return x.type==="om_register*"||x.type==="FunctionExpression" ? x.text : `new_register(${x.text})`; };
            //text += conv(init);
            text += init;
            return text;
        } break;
        case "ArrayExpression": {
            let elements = ast.elements;
            //let text = "new (GC) om_list(new (GC) om_list_data{";
            let text = "new_list({";
            let list = [];
            for (let e of elements) {
                list.push(compile_ast(e));
            }
            text += list.join(",");
            //text += "})";
            text += "})";
            return text;
        } break;
        case "ObjectExpression": {
            //let text = "new (GC) om_dict(new (GC) om_dict_data{";
            let text = "new_dict({";
            let properties = ast.properties;
            let plist = [];
            for (let p of properties) {
                let ptext = "{";
                let key = p.key;
                switch(key.type) {
                    case "Identifier": {
                        key = `"${key.name}"`;
                    } break;
                    case "StringLiteral": {
                        key = key.extra.raw;
                    } break;
                }
                ptext+=key;
                ptext+=",";
                ptext+=compile_ast(p.value);
                ptext+="}";
                plist.push(ptext);
            }
            text+=plist.join(",");
            text+="})";
            return text;
        } break;
        default:
            throw new Error(`AST node type "${ast.type}" is not expected.`)
            break;
    }
}