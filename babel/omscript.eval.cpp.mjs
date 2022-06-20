import * as common from "./omscript.common.mjs";

let sym_count = 0;

function gensym(prefix) {
    sym_count++;
    return `__${prefix}${sym_count}__`;
}

function compile_body(body, info, add_undefined) {
    let text = "{";
    if (add_undefined) text += "{";
    for (let step of body) {
        step = compile_ast(step, info);
        text += step;
        text += ";";
    }
    text += "}";
    if (add_undefined) text += "return undefined;}";
    return text;
}

function compile_consequent(body, info) {
    let text = "";
    for (let step of body) {
        step = compile_ast(step, info);
        text += step;
        text += ";";
    }
    return text;
}

function compile_switch(ast, info) {
    let discriminant = ast.discriminant;
    common.printAsJson(discriminant, "switch(discriminant)");
    let text = "";
    //text += "do {";
    text += "{{";
    let sym = gensym("switch");
    text += `om_register *${sym}=${compile_ast(discriminant, info)};`;
    let cases = [];
    let has_default = false;
    let default_label = gensym("default");
    let break_label = gensym("break");
    info = Object.assign({}, info);
    info.break_label = break_label;
    for (let case_ of ast.cases) {
        case_ = { test: case_.test, label: (case_.test !== null) ? gensym("label") : default_label, consequent: case_.consequent };
        //common.printAsJson(case_);
        if (case_.test === null) has_default = true;
        cases.push(case_);
    }
    for (let case_ of cases) {
        if (case_.test !== null) {
            text += `if(eq(${sym},${compile_ast(case_.test, info)})) goto ${case_.label};`;
        }
    }
    text += `goto ${default_label};`
    for (let case_ of cases) {
        if (case_.test === null) {
            text += `${default_label}:;`
        } else {
            text += `${case_.label}:;`
        }
        text += compile_consequent(case_.consequent, info);
    }
    if (!has_default) {
        text += `${default_label}:;`
    }
    //text += "} while(false)";
    text += `}${break_label}:;}`;
    return text;
}

export function compile_ast(ast, info = {}) {
    common.printAsJson(ast.type, "ast.type");
    //common.printAsJson(ast, "ast");
    switch (ast.type) {
        case "FunctionExpression": {
            let text = "new_func(";
            text += "[&](om_list_data __arguments__)->om_register*{";
            let params = [];
            let i = 0;
            for (let param of ast.params) {
                params.push(`om_register* ${param.name}=get_arg(__arguments__, ${i});`);
                i++;
            }
            text += params.join("");
            text += compile_body(ast.body.body, info, true);
            text += "})";
            return text;
        } break;
        case "FunctionDeclaration": {
            let text = "";
            text += "om_register* " + ast.id.name + "= new_func("
            text += "[&](om_list_data __arguments__)->om_register*{";
            let params = [];
            let i = 0;
            for (let param of ast.params) {
                params.push(`om_register* ${param.name}=get_arg(__arguments__, ${i});`);
                i++;
            }
            text += params.join("");
            text += compile_body(ast.body.body, info, true);
            text += "})";
            return text;
        } break;
        case "ReturnStatement": {
            let argument = compile_ast(ast.argument, info);
            return "return " + argument;
        } break;
        case "BinaryExpression": {
            let left = compile_ast(ast.left, info);
            let right = compile_ast(ast.right, info);
            return "(" + `(*(${left}))` + ast.operator + `(*(${right}))` + ")";
        } break;
        case "Identifier": {
            return ast.name;
        } break;
        case "ExpressionStatement": {
            return compile_ast(ast.expression, info);
        } break;
        case "CallExpression": {
            let text = `(*${ast.callee.name})({`;
            let args = [];
            for (let arg of ast.arguments) {
                arg = compile_ast(arg, info);
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
            let init = compile_ast(declaration.init, info);
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
                list.push(compile_ast(e, info));
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
                switch (key.type) {
                    case "Identifier": {
                        key = `"${key.name}"`;
                    } break;
                    case "StringLiteral": {
                        key = key.extra.raw;
                    } break;
                }
                ptext += key;
                ptext += ",";
                ptext += compile_ast(p.value, info);
                ptext += "}";
                plist.push(ptext);
            }
            text += plist.join(",");
            text += "})";
            return text;
        } break;
        case "TemplateLiteral": {
            //common.printAsJson(ast);
            let quasis = ast.quasis;
            let expressions = ast.expressions;
            let text = "";
            text += "new_string(";
            let list = [];
            for (let i = 0; i < quasis.length; i++) {
                let q = quasis[i];
                list.push(`std::string(${JSON.stringify(q.value.raw)})`);
                if (q.tail) break;
                let e = expressions[i];
                list.push(`string_value(${compile_ast(e, info)})`);
            }
            text += list.join("+");
            text += ")";
            return text;
        } break;
        case "SwitchStatement": {
            common.printAsJson(ast);
            return compile_switch(ast, info);
        } break;
        case "BlockStatement": {
            return compile_body(ast.body, info);
        } break;
        case "BreakStatement": {
            if (info.break_label)
                return `goto ${info.break_label}`;
            return "break";
        } break;
        default:
            common.printAsJson(ast);
            throw new Error(`AST node type "${ast.type}" is not expected.`);
            break;
    }
}