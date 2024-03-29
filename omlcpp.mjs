import { oml2ast } from "./oml2ast.mjs";
import { OMLCommon } from "./omlcommon.mjs";

class OMLCppCommon extends OMLCommon {
    to_id(ast) {
        if (this.is_id(ast)) {
            let ids = ast.slice(1);
            return ids.join("_");
        } else if (this.is_script(ast)) {
            return "@";
        }
        return ast;
    }
    val_type(ast) {
        if (!this.is_fn(ast)) return "oml_root*";
        let result = "std::function<oml_root*(";
        let args = ast[1];
        for (let i = 0; i < args.length; i++) {
            if (i > 0) result += ",";
            result += "oml_root*";
        }
        result += ")>";
        return result;
    }
    val_body(ast) {
        if (!this.is_fn(ast)) return compile_ast(ast);
        let result = "[&](";
        let args = ast[1];
        for (let i = 0; i < args.length; i++) {
            if (i > 0) result += ",";
            result += "oml_root* ";
            result += this.to_id(args[i]);
        }
        result += ")->oml_root*{";
        result += ("return " + compile_body(ast, 2) + ";");
        result += "}";
        return result;
    }
}
let common = new OMLCppCommon();

const CPP_HEAD =
    `#include "omlcpp.h"

int main() {
    GC_INIT();
    static oml_root *null = new_null();
    static oml_root *undefined = new_undefined();
    `;

const CPP_TAIL =
    `
    return 0;
}
`

function compile_bool(ast) {
    if (common.is_bool(ast)) return ast.toString();
    return `bool_value(${compile_ast(ast)})`;
}

function compile_number(ast) {
    if (common.is_number(ast)) return ast.toString();
    return `number_value(${compile_ast(ast)})`;
}

function compile_string(ast) {
    if (common.is_string(ast))
        return `std::string(${JSON.stringify(ast)})`
    return `string_value(${compile_ast(ast)})`;
}

function compile_body_helper(body) {
    if (body.length === 0) return null;
    let result = "(";
    for (let i = 0; i < body.length; i++) {
        if (i > 0)
            result += ",";
        let def = common.to_def(body[i]);
        if (def !== null) {
            if (common.is_fn(def[2])) {
                let args = def[2][1];
                let proto = common.val_type(def[2]);
                let let_ast = [common.id("let*"), [[def[1], def[2], proto]], ...body.slice(i + 1)];
                return result + compile_ast(let_ast) + ")";
            }
            let let_ast = [common.id("let*"), [[def[1], def[2]]], ...body.slice(i + 1)];
            return result + compile_ast(let_ast) + ")";
        }
        result += compile_ast(body[i]);
    }
    return result + ")";
}

function compile_body(ast, start) {
    let body = [];
    let prologue = "";
    for (let i = start; i < ast.length; i++) {
        if (common.is_quoted(ast[i])) {
            prologue += ast[i][1];
            continue;
        }
        body.push(ast[i]);
    }
    return prologue + compile_body_helper(body);
}

function compile_ast(ast) {
    if (ast === null)
        return "null";
    if (ast === undefined)
        return "undefined";
    if (common.is_bool(ast)) {
        return `new_bool(${ast})`;
    }
    if (typeof ast === "number") {
        return `new_number(${ast})`;
    }
    if (typeof ast === "string") {
        return `new_string(${JSON.stringify(ast)})`;
    }
    if (!(ast instanceof Array)) {
        return ast.toString();
    }
    if (ast.length === 0)
        return "[]";
    if (common.is_quoted(ast)) {
        return ast[1];
    }
    if (common.is_variable(ast)) {
        return common.to_id(ast);
    }
    if (common.is_script(ast)) {
        return ast[1];
    }
    if (!common.is_callable(ast)) {
        return compile_ast([common.id("list"), ...ast]);
    }
    switch (common.to_id(ast[0])) {
        case "@": {
            let fcall = ast[0][1] + "(";
            for (let i = 1; i < ast.length; i++) {
                if (i > 1)
                    fcall += ",";
                fcall += compile_ast(ast[i]);
            }
            fcall += ")";
            return fcall;
        }
        case "begin":
            return compile_body(ast, 1);
        case "case": {
            let cond_ast = [common.id("cond")];
            for (let i = 2; i < ast.length; i++) {
                let e = ast[i];
                if (common.is_id(e[0], "else") || common.is_id(e[0], "otherwise")) {
                    cond_ast.push(e);
                } else {
                    cond_ast.push([[common.id("equal"), common.id("__case__"), e[0]], ...e.slice(1)]);
                }
            }
            //return compile_ast([common.id("let*"), [[common.id("__case__"), ast[1]]], cond_ast]);
            let new_ast = [common.id("let*"), [[common.id("__case__"), ast[1]]], cond_ast];
            //print(new_ast);
            return compile_ast(new_ast);
        }
        case "_cond": {
            function _cond_builder(rest) {
                if (rest.length === 0)
                    return null;
                let condition = rest.shift();
                condition = common.to_id(condition);
                let action = rest.shift();
                switch (condition) {
                    case true:
                    case "else":
                    case "otherwise":
                        return action;
                }
                return [common.id("if"), condition, action, _cond_builder(rest)];
            }
            ast = _cond_builder(ast.slice(1));
            return compile_ast(ast);
        }
        case "cond": {
            let new_ast = [];
            ast.slice(1).forEach((x) => {
                new_ast.push(x[0]);
                new_ast.push([["#", "begin"]].concat(x.slice(1)));
            });
            new_ast.unshift(["#", "_cond"]);
            return compile_ast(new_ast);
        }
        case "dec!":
        case "inc!":
            let sign = common.to_id(ast[0]) === "dec!" ? "-" : "+";
            let val = ast.length < 3 ? 1 : compile_ast(ast[2]);
            return compile_ast(ast[1]) + sign + "=" + val;
        case "def": {
            ast = common.to_def(ast);
            return common.val_type(ast[2]) + " " + common.to_id(ast[1]) + "=" + common.val_body(ast[2]);
        }
        case "define": case "defun": case "defvar": {
            ast = common.to_def(ast);
            return compile_ast(ast);
        }
        case "do":
        case "do*":
            return compile_do(ast);
        case "fn":
        case "lambda": {
            return common.val_body(ast);
        }
        case "dotimes": {
            let ast1 = ast[1];
            if (!common.is_array(ast1) || common.is_quoted(ast1))
                ast1 = [common.id("$index"), ast1];
            else if (ast1.length < 2)
                throw new Error("syntax error");
            let result_exp = ast1.length < 3 ? common.id("null") : ast1[2];
            let bind = [
                [common.id("__dotimes_cnt__"), ast1[1]],
                [common.id("__dotimes_idx__"), 0, [common.id("+"), common.id("__dotimes_idx__"), 1]],
                [ast1[0], common.id("__dotimes_idx__"), common.id("__dotimes_idx__")],
            ];
            let exit = [[common.id(">="), common.id("__dotimes_idx__"), common.id("__dotimes_cnt__")], result_exp];
            ast = [common.id("do*"), bind, exit].concat(ast.slice(2));
            return compile_ast(ast);
        }
        case "length": {
            if (ast.length != 2) return new Error("syntax error");
            return "(" + compile_ast(ast[1]) + ").length";
        }
        case "prop-get": {
            if (ast.length != 3) return new Error("syntax error");
            return compile_ast(ast[1]) + "[" + compile_ast(ast[2]) + "]";
        }
        case "prop-set!": {
            if (ast.length != 4) return new Error("syntax error");
            return compile_ast(ast[1]) + "[" + compile_ast(ast[2]) + "]=" + compile_ast(ast[3]);
        }
        case "dolist": {
            let ast1 = ast[1];
            if (common.is_variable(ast1) || !common.is_array(ast1) || common.is_quoted(ast1))
                ast1 = [common.id("$item"), ast1];
            else if (ast1.length < 2)
                throw new Error("syntax error");
            let result_exp = ast1.length < 3 ? common.id("null") : ast1[2];
            let bind = [
                [common.id("__dolist_list__"), ast1[1]],
                [common.id("__dolist_cnt__"), [common.id("length"), common.id("__dolist_list__")]],
                [common.id("__dolist_idx__"), 0, [common.id("+"), common.id("__dolist_idx__"), 1]],
                [ast1[0], [common.id("prop-get"), common.id("__dolist_list__"), common.id("__dolist_idx__")], [common.id("prop-get"), common.id("__dolist_list__"), common.id("__dolist_idx__")]],
            ];
            let exit = [[common.id(">="), common.id("__dolist_idx__"), common.id("__dolist_cnt__")], result_exp];
            ast = [common.id("do*"), bind, exit].concat(ast.slice(2));
            return compile_ast(ast);
        }
        case "if":
            return ("(bool_value(" +
                compile_bool(ast[1]) +
                ")?" +
                compile_ast(ast[2]) +
                ":" +
                compile_body(ast, 3) +
                ")");
        case "let":
        case "let*": {
            let ast1 = ast[1];
            let new_ast1 = [];
            for (let x of ast1) {
                if (typeof x === "string") {
                    new_ast1.push("oml_root*");
                    new_ast1.push(x);
                    new_ast1.push("0");
                } else if (x.length >= 3) {
                    new_ast1.push(x[2]);
                    new_ast1.push(x[0]);
                    new_ast1.push(x[1]);
                } else {
                    new_ast1.push("oml_root*");
                    new_ast1.push(x[0]);
                    new_ast1.push(x[1]);
                }
            }
            return compile_ast([common.id("_" + common.to_id(ast[0])), new_ast1].concat(ast.slice(2)));
        }
        case "_let":
        case "_let*": {
            let vars = "(";
            let vals = "(";
            let voids = "(";
            let assigns = "";
            console.log("ast=" + JSON.stringify(ast));
            console.log("ast[1]=" + JSON.stringify(ast[1]));
            for (let i = 2; i <= ast[1].length; i += 3) {
                console.log("i=" + i);
                if (i > 2)
                    vars += ",";
                vars += common.to_id(ast[1][i - 2]) + " " + common.to_id(ast[1][i - 1]);
                let val = compile_ast(ast[1][i]);
                if (i > 2)
                    vals += ",";
                vals += val;
                if (i > 2)
                    voids += ",";
                voids += "0";
                assigns += common.to_id(ast[1][i - 1]) + "=" + val + ";";
            }
            vars += ")";
            vals += ")";
            voids += ")";
            if (ast[0] === "_let")
                return ("([&]" +
                    vars +
                    "{return " +
                    compile_body(ast, 2) +
                    ";})" +
                    vals);
            else
                return ("([&]" +
                    vars +
                    "{" +
                    assigns +
                    "return " +
                    compile_body(ast, 2) +
                    ";})" +
                    voids);
        }
        /*
        case "list": {
            let result = "new_list(new (GC) oml_list_data {";
            for (let i = 1; i < ast.length; i++) {
                if (i > 1) result += ",";
                result += compile_ast(ast[i]);
            }
            result += "})";
            return result;
        }
        */
        case "list": {
            ast = ast.slice(1);
            let found = -1;
            for (let i = 0; i < ast.length; i++) {
                let e = ast[i];
                if (common.is_id(e) && common.to_id(e) === "?") {
                    found = i;
                    break;
                }
            }
            let list;
            let dict;
            if (found === -1) {
                list = ast;
                dict = [];
            } else if (found === 0) {
                list = [];
                dict = ast.slice(1);
            } else {
                list = ast.slice(0, found);
                dict = ast.slice(found + 1);
            }
            let result = "new_list(new (GC) oml_list_data {";
            for (let i = 0; i < list.length; i++) {
                if (i > 0) result += ",";
                result += compile_ast(list[i]);
            }
            result += "},new (GC) oml_dict_data {";
            for (let i = 0; i < dict.length; i++) {
                if (i > 0) result += ",";
                let pair = dict[i];
                if (common.is_string(pair)) pair = [pair, true];
                result += "{";
                result += (common.is_string(pair[0]) ? JSON.stringify(pair[0]) : compile_ast(pair[0]));
                result += ",";
                result += compile_ast(pair[1]);
                result += "}";
            }
            result += "})";
            return result;
        }
        case "dict": {
            if ((ast.length % 2) !== 1) throw new Error("synatx error");
            let result = "new_dict(new (GC) oml_dict_data {";
            for (let i = 1; i < ast.length; i += 2) {
                if (i > 1) result += ",";
                result += "{";
                result += (common.is_string(ast[i]) ? JSON.stringify(ast[i]) : compile_ast(ast[i]));
                result += ",";
                result += compile_ast(ast[i + 1]);
                result += "}";
            }
            result += "})";
            return result;
        }
        case "set!":
            return compile_ast(ast[1]) + "=" + compile_ast(ast[2]);
        case "throw": {
            return "(function(){throw " + compile_ast(ast[1]) + "})()";
        }
        case "try": {
            let result = "(function(){try{return " + compile_ast(ast[1]) + "}catch(";
            if (common.to_id(ast[2][0]) != "catch") throw "try without catch clause";
            result += common.to_id(ast[2][1]) + "){return " + compile_body(ast[2], 2) + "}";
            result += "})()";
            return result;
        }
        case "until":
        case "while": {
            let condition = compile_ast(ast[1]);
            if (common.to_id(ast[0]) === "until")
                condition = "!" + condition;
            return ("(([&]()->void {while(" +
                condition +
                "){" +
                compile_body(ast, 2) +
                ";}})(),0)");
        }
        case ".": {
            let op = "+";
            let rest = ast.slice(1);
            let result = [];
            for (let i = 0; i < rest.length; i++) {
                if (i > 0) result.push(op);
                result.push(compile_string(rest[i]));
            }
            return `new_string(${result.join("")})`;
        }
        case "=":
            return "(" + compile_ast(ast[1]) + "===" + compile_ast(ast[2]) + ")";
        case "%":
        case "==":
        case "===":
        case "!=":
        case "!==":
        case "<":
        case ">":
        case "<=":
        case ">=":
            return "(" + compile_number(ast[1]) + common.to_id(ast[0]) + compile_number(ast[2]) + ")";
        case "&&":
        case "||":
        case "&":
        case "|":
        case "+":
        case "-":
        case "*":
        case "**":
        case "/": {
            return "(" + insert_op(common.to_id(ast[0]), ast.slice(1)) + ")";
        }
        default: {
            let fcall = common.to_id(ast[0]) + "(";
            for (let i = 1; i < ast.length; i++) {
                if (i > 1)
                    fcall += ",";
                fcall += compile_ast(ast[i]);
            }
            fcall += ")";
            return fcall;
        }
    }
}

function insert_op(op, rest) {
    if (rest.length === 1)
        return op + compile_number(rest[0]);
    let result = [];
    for (let i = 0; i < rest.length; i++) {
        if (i > 0) result.push(op);
        result.push(compile_number(rest[i]));
    }
    //return result.join("");
    return `new_number(${result.join("")})`;
}

function compile_do(ast) {
    let ast1 = ast[1];
    let parallel = common.to_id(ast[0]) === "do";
    let ast1_len = ast1.length;
    let ast1_vars = [];
    ast1.forEach((x) => {
        ast1_vars.push("oml_root*");
        ast1_vars.push(x[0]);
        ast1_vars.push(x[1]);
    });
    let ast2 = ast[2];
    if (ast2.length < 2)
        ast2 = [ast2[0], null];
    let until_ast = parallel ?
        //[common.id("until"), ast2[0], "#oml_root* __do__[" + ast1_len + "];", ...ast.slice(3)] :
        [common.id("until"), ast2[0], ["`", "oml_root* __do__[" + ast1_len + "];"], ...ast.slice(3)] :
        [common.id("until"), ast2[0], ...ast.slice(3)];
    if (parallel) {
        ast1.forEach((x, i) => {
            if (x.length < 3)
                return;
            let next_step = [common.id("set!"), ["`", "__do__[" + i + "]"], x[2]];
            until_ast.push(next_step);
        });
        ast1.forEach((x, i) => {
            if (x.length < 3)
                return;
            let next_step = [common.id("set!"), x[0], ["`", "__do__[" + i + "]"]];
            until_ast.push(next_step);
        });
    }
    else {
        ast1.forEach((x) => {
            if (x.length < 3)
                return;
            let next_step = [common.id("set!"), x[0], x[2]];
            until_ast.push(next_step);
        });
    }
    let new_ast = [common.id(parallel ? "_let" : "_let*"), ast1_vars].concat([until_ast]);
    new_ast.push(ast2[1]);
    return compile_ast(new_ast);
}

export function omlcpp() {
    let glob = {};
    glob.compile_ast = (ast, debug) => {
        if (debug)
            console.log(" [AST] " + JSON.stringify(ast));
        let code = compile_ast(ast);
        if (debug)
            console.log("[CODE] " + code);
        return code;
    };
    glob.compile = (text, debug) => {
        let steps = oml2ast(text);
        let result = "";
        for (let step of steps) {
            let exp = step[0];
            let ast = step[1];
            if (debug)
                console.log(" [OML] " + exp);
            if (debug)
                console.log(" [AST] " + JSON.stringify(ast));
            let code = compile_ast(ast);
            if (debug)
                console.log("[CODE] " + code);
            result += code + ";\n";
        }
        return CPP_HEAD + result + CPP_TAIL;
    };
    glob.exec_d = (exp) => glob.exec(exp, true);
    glob.exec = (exp, debug) => {
        let src = exp;
        let steps = oml2ast(src);
        let last;
        let text = "";
        for (let step of steps) {
            let exp = step[0];
            let ast = step[1];
            var tm1 = new Date().getTime();
            try {
                if (debug)
                    console.log(" [OML] " + exp);
                if (debug)
                    console.log(" [AST] " + JSON.stringify(ast));
                text = compile_ast(ast);
                if (debug)
                    console.log("[CODE] " + text);
                let val = eval(text);
                last = val;
                let output;
                if (typeof val === "function") {
                    output = "function";
                }
                else if (!(val instanceof Array) &&
                    val instanceof Object &&
                    Object.prototype.toString.call(val) !== "[object Object]") {
                    try {
                        output =
                            Object.prototype.toString.call(val) + " " + JSON.stringify(val);
                    }
                    catch (e) { }
                }
                else {
                    try {
                        output = JSON.stringify(val);
                    }
                    catch (e) { }
                }
                var tm2 = new Date().getTime();
                if (debug) {
                    if (output === undefined) {
                        console.log("==> (" + (tm2 - tm1) + " ms)");
                        console.log(val);
                    }
                    else {
                        console.log("==> " + output + " (" + (tm2 - tm1) + " ms)");
                    }
                }
            }
            catch (e) {
                if (!debug)
                    console.log(" [OML] " + exp);
                if (!debug)
                    console.log(" [AST] " + JSON.stringify(ast));
                if (!debug)
                    console.log("[CODE] " + text);
                console.log("[EXCEPTION]");
                if (e.stack)
                    console.log(e.stack);
                else
                    console.log(e);
                throw e;
                break;
            }
        }
        return last;
    };
    glob.run = (exp) => glob.exec(exp, true);
    glob.execAll = (exp, debug) => {
        let text = glob.compile(exp, debug);
        try {
            return eval(text);
        } catch (e) {
            if (e.stack)
                console.log(e.stack);
            else
                console.log(e);
            throw e;
        }
    };
    glob.runAll = (exp) => {
        return glob.execAll(exp, true);
    };
    return glob;
}

export function run(exp) {
    let o = omljs();
    return o.run(exp);
}

export function runAll(exp) {
    let o = omljs();
    return o.runAll(exp);
}
