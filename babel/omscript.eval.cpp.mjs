import * as common from "./omscript.common.mjs";

function compile_body(body)
{
    let text = "{{";
    for (let step of body) {
        step = compile_ast(step);
        text += step;
        text += ";";
    }
    text += "}return undefined;}";
    return text;
}

export function compile_ast(ast) {
    common.printAsJson(ast.type, "ast.type");
    //common.printAsJson(ast, "ast");
    switch (ast.type) {
        case "FunctionExpression": {
            let text = "new_func(";
            text += "[&](om_list_data __arguments__)->om_register*{";
            let params = [];
            let i=0;
            for (let param of ast.params) {
                params.push(`om_register* ${param.name}=get_arg(__arguments__, ${i});`);
                i++;
            }
            text += params.join("");
            text += compile_body(ast.body.body);
            text += "})";
            return text;
        } break;
        case "FunctionDeclaration": {
            let text = "";
            text += "om_register* " + ast.id.name + "= new_func("
            text += "[&](om_list_data __arguments__)->om_register*{";
            let params = [];
            let i=0;
            for (let param of ast.params) {
                params.push(`om_register* ${param.name}=get_arg(__arguments__, ${i});`);
                i++;
            }
            text += params.join("");
            text += compile_body(ast.body.body);
            text += "})";
            return text;
        } break;
        case "ReturnStatement": {
            let argument = compile_ast(ast.argument);
            return "return " + argument;
        } break;
        case "BinaryExpression": {
            let left = compile_ast(ast.left);
            let right = compile_ast(ast.right);
            return "(" + `(*(${left}))` + ast.operator + `(*(${right}))` + ")";
        } break;
        case "Identifier": {
            return ast.name;
        } break;
        case "ExpressionStatement": {
            return compile_ast(ast.expression);
        } break;
        case "CallExpression": {
            let text = `(*${ast.callee.name})({`;
            let args = [];
            for (let arg of ast.arguments) {
                arg = compile_ast(arg);
                args.push(arg);
            }
            text += args.join(",");
            text += "})";
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
        case "TemplateLiteral": {
            //common.printAsJson(ast);
            let quasis = ast.quasis;
            let expressions = ast.expressions;
            let text = "";
            text += "new_string(";
            let list = [];
            for (let i=0; i<quasis.length; i++) {
                let q = quasis[i];
                list.push(`std::string(${JSON.stringify(q.value.raw)})`);
                if (q.tail) break;
                let e = expressions[i];
                list.push(`string_value(${compile_ast(e)})`);
            }
            text += list.join("+");
            text += ")";
            return text;
        } break;
        default:
            common.printAsJson(ast);
            throw new Error(`AST node type "${ast.type}" is not expected.`);
            break;
    }
}