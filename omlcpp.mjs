import { oml2ast } from "./oml2ast.mjs";

const CPP_HEAD =
    `#include "omlcpp.h"
#include <iostream>
#include <functional>
#include <vector>
#include <gc/gc.h>
#include <gc/gc_cpp.h>

int main() {
    GC_INIT();
`;

const CPP_TAIL =
    `
    return 0;
}
`

function is_array(x) {
    return (x instanceof Array);
}

function is_strging(x) {
    return (typeof x) === "string";
}

function is_fn(x) {
    if (!is_array(x)) return false;
    if (x.length === 0) return false;
    return x[0] === "fn" || x[0] === "lambda";
}

function is_quoted(x) {
    if (!is_array(x)) return false;
    if (x.length === 0) return false;
    return x[0] === "`";
}

function to_def(ast) {
    if (!is_array(ast)) return null;
    if (ast.length === 0) return null;
    switch (ast[0]) {
        case "def": {
            if (ast.length < 2) throw new Error("sysntax error");
            let ast1 = ast[1];
            let ast2 = ast.length === 2 ? null : ast[2];
            return ["def", ast1, ast2];
        }
        case "defvar": {
            if (ast.length < 2) throw new Error("sysntax error");
            let ast1 = ast[1];
            let ast2 = ast.length === 2 ? null : ast[2];
            return ["def", ast1, ast2];
        }
        case "defun": {
            let new_ast = ast.slice(3);
            new_ast.unshift(ast[2]);
            new_ast.unshift("fn");
            return ["def", ast[1], new_ast];
        }
        case "define": {
            if (ast[1] instanceof Array) {
                if (ast.length < 2) throw new Error("sysntax error");
                let new_ast = ast.slice(2);
                return to_def(["defun", ast[1][0], ast[1].slice(1), ...new_ast]);
            }
            else {
                if (ast.length < 2) throw new Error("sysntax error");
                let ast1 = ast[1];
                let ast2 = ast.length === 2 ? null : ast[2];
                return to_def(["defvar", ast1, ast2]);
            }
        }
        default:
            return null;
    }
}

function compile_body_helper(body) {
    if (body.length === 0) return null;
    let result = "(";
    for (let i = 0; i < body.length; i++) {
        if (i > 0)
            result += ",";
        let def = to_def(body[i]);
        if (def !== null) {
            if (is_fn(def[2])) {
                //throw new Error(def[1] + ": local function is not allowed in C++");
                let args = def[2][1];
                let args_types = new Array(args.length).fill("oml_root*");
                let proto = "std::function< oml_root*(" + args_types.join(",") + ") >";
                let let_ast = ["let*", [[def[1], def[2], proto]], ...body.slice(i + 1)];
                return result + compile_ast(let_ast) + ")";
                }
            let let_ast = ["let*", [[def[1], def[2]]], ...body.slice(i + 1)];
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
        if (is_strging(ast[i]) && ast[i][0] == "#") {
            prologue += ast[i].substr(1);
            continue;
        }
        body.push(ast[i]);
    }
    return prologue + compile_body_helper(body);
}

function compile_body1(ast) {
    if (to_def(ast) !== null) throw Error("def is not allowed here");
    return compile_ast(ast);
}

function compile_ast(ast) {
    if (ast === undefined)
        return "undefined";
    if (!ast) {
        return JSON.stringify(ast);
    }
    if (typeof ast === "number") {
        return `new_number(${ast})`;
    }
    if (typeof ast === "string") {
        if (ast.match(/^:.+$/) || ast.match(/^#.+$/))
            return JSON.stringify(ast);
        return ast;
    }
    if (!(ast instanceof Array)) {
        return ast.toString();
    }
    if (ast.length === 0)
        return "[]";
    switch (ast[0]) {
        case "`":
            return JSON.stringify(ast[1]);
        case "@":
            return ast[1];
        case "begin":
            return compile_body(ast, 1);
        case "case": {
            let result = "(function(){switch(" + compile_body1(ast[1]) + "){";
            let rest = ast.slice(2);
            rest.forEach((x) => {
                let val = x[0];
                switch (val) {
                    case ":else":
                    case "else":
                    case "otherwise":
                    case ":otherwise":
                        result += "default:";
                        break;
                    default:
                        if (val instanceof Array && val[0] === "`")
                            val = val[1];
                        result += "case " + JSON.stringify(val) + ":";
                }
                let body = compile_body(x, 1);
                result += "return " + body + ";";
            });
            result += "}return null})()";
            return result;
        }
        case "_cond": {
            function _cond_builder(rest) {
                if (rest.length === 0)
                    return null;
                let condition = rest.shift();
                let action = rest.shift();
                switch (condition) {
                    case true:
                    case ":else":
                    case "else":
                    case "otherwise":
                    case ":otherwise":
                        return action;
                }
                return ["if", condition, action, _cond_builder(rest)];
            }
            ast = _cond_builder(ast.slice(1));
            return compile_ast(ast);
        }
        case "cond": {
            let new_ast = [];
            ast.slice(1).forEach((x) => {
                new_ast.push(x[0]);
                new_ast.push(["begin"].concat(x.slice(1)));
            });
            new_ast.unshift("_cond");
            return compile_ast(new_ast);
        }
        case "dec!":
        case "inc!":
            let sign = ast[0] === "dec!" || ast[0] === "dec" ? "-" : "+";
            let val = ast.length < 3 ? 1 : compile_ast(ast[2]);
            return compile_body1(ast[1]) + sign + "=" + val;
        case "def": {
            ast = to_def(ast);
            return "static auto " + ast[1] + "=" + compile_body1(ast[2]);
        }
        case "defvar": {
            if (ast.length < 2) throw new Error("sysntax error");
            let vname = ast[1];
            let value = ast.length === 2 ? "0" : compile_ast(ast[2]);
            return "static oml_root* " + vname + " = " + value;
        }
        case "defun": {
            if (ast.length < 3) throw new Error("sysntax error");
            let fname = ast[1];
            let args = ast[2];
            let args_types = new Array(args.length).fill("oml_root*");
            let code = "static std::function< oml_root*(" + args_types.join(",") + ") > ";
            code += fname;
            code += " = [=](";
            code += args.map((x, index) => "oml_root* " + x).join(",")
            code += ")->oml_root* {";
            code += "return " + compile_body(ast, 3) + ";";
            code += "}";
            return code;
        }
        case "define": {
            if (ast[1] instanceof Array) {
                if (ast.length < 2) throw new Error("sysntax error");
                let new_ast = ast.slice(2);
                return compile_ast(["defun", ast[1][0], ast[1].slice(1), ...new_ast]);
            }
            else {
                if (ast.length < 2) throw new Error("sysntax error");
                let ast1 = ast[1];
                let ast2 = ast.length === 2 ? null : ast[2];
                return compile_ast(["defvar", ast1, ast2]);
            }
        }
        case "do":
        case "do*":
            return compile_do(ast);
        case "fn":
        case "lambda": {
            let args = "(";
            for (let i = 0; i < ast[1].length; i++) {
                if (i > 0)
                    args += ",";
                args += "oml_root* " + ast[1][i];
            }
            args += ")";
            if (ast.length < 3)
                return "[=]" + args + "{}";
            return "[=]" + args + "{return " + compile_body(ast, 2) + ";}";
        }
        case "dotimes": {
            let ast1 = ast[1];
            if (!is_array(ast1) || is_quoted(ast1))
                ast1 = ["$index", ast1];
            else if (ast1.length < 2)
                throw new Error("syntax error");
            let result_exp = ast1.length < 3 ? "null" : ast1[2];
            let bind = [
                ["__dotimes_cnt__", ast1[1]],
                ["__dotimes_idx__", 0, ["+", "__dotimes_idx__", 1]],
                [ast1[0], "__dotimes_idx__", "__dotimes_idx__"],
            ];
            let exit = [[">=", "__dotimes_idx__", "__dotimes_cnt__"], result_exp];
            ast = ["do*", bind, exit].concat(ast.slice(2));
            return compile_ast(ast);
        }
        case "length": {
            if (ast.length != 2) return new Error("syntax error");
            return "(" + compile_body1(ast[1]) + ").length";
        }
        case "prop-get": {
            if (ast.length != 3) return new Error("syntax error");
            return compile_body1(ast[1]) + "[" + compile_body1(ast[2]) + "]";
        }
        case "prop-set!": {
            if (ast.length != 4) return new Error("syntax error");
            return compile_body1(ast[1]) + "[" + compile_body1(ast[2]) + "]=" + compile_body1(ast[3]);
        }
        case "dolist": {
            let ast1 = ast[1];
            if (!is_array(ast1) || is_quoted(ast1))
                ast1 = ["$item", ast1];
            else if (ast1.length < 2)
                throw new Error("syntax error");
            let result_exp = ast1.length < 3 ? "null" : ast1[2];
            let bind = [
                ["__dolist_list__", ast1[1]],
                ["__dolist_cnt__", ["length", ast1[1]]],
                ["__dolist_idx__", 0, ["+", "__dolist_idx__", 1]],
                [ast1[0], ["prop-get", "__dolist_list__", "__dolist_idx__"], ["prop-get", "__dolist_list__", "__dolist_idx__"]],
            ];
            let exit = [[">=", "__dolist_idx__", "__dolist_cnt__"], result_exp];
            ast = ["do*", bind, exit].concat(ast.slice(2));
            return compile_ast(ast);
        }
        case "if":
            return ("(" +
                compile_body1(ast[1]) +
                "?" +
                compile_body1(ast[2]) +
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
            return compile_ast(["_" + ast[0], new_ast1].concat(ast.slice(2)));
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
                vars += ast[1][i - 2] + " " + ast[1][i - 1];
                let val = compile_body1(ast[1][i]);
                if (i > 2)
                    vals += ",";
                vals += val;
                if (i > 2)
                    voids += ",";
                voids += "0";
                assigns += ast[1][i - 1] + "=" + val + ";";
            }
            vars += ")";
            vals += ")";
            voids += ")";
            if (ast[0] === "_let")
                return ("([=]" +
                    vars +
                    "{return " +
                    compile_body(ast, 2) +
                    ";})" +
                    vals);
            else
                return ("([=]" +
                    vars +
                    "{" +
                    assigns +
                    "return " +
                    compile_body(ast, 2) +
                    ";})" +
                    voids);
        }
        case "list": {
            let result = "[";
            for (let i = 1; i < ast.length; i++) {
                if (i > 1) result += ",";
                result += compile_body1(ast[i]);
            }
            result += "]";
            return result;
        }
        case "dict": {
            if ((ast.length % 2) !== 1) throw new Error("synatx error");
            let body = [];
            for (let i = 1; i < ast.length; i += 2) {
                body.push(["prop-set!", "__dict__", ast[i], ast[i + 1]]);
            }
            body.push("__dict__");
            ast = ["let*", [["__dict__", "{}"]], ...body];
            return compile_ast(ast);
        }
        case "set!":
            return compile_body1(ast[1]) + "=" + compile_body1(ast[2]);
        case "throw": {
            return "(function(){throw " + compile_body1(ast[1]) + "})()";
        }
        case "try": {
            let result = "(function(){try{return " + compile_body1(ast[1]) + "}catch(";
            if (ast[2][0] != "catch") throw "try without catch clause";
            result += ast[2][1] + "){return " + compile_body(ast[2], 2) + "}";
            result += "})()";
            return result;
        }
        case "until":
        case "while": {
            let condition = compile_body1(ast[1]);
            if (ast[0] === "until")
                condition = "!" + condition;
            return ("(([&]()->void {while(" +
                condition +
                "){" +
                compile_body(ast, 2) +
                ";}})(),0)");
        }
        case "=":
            return "(" + compile_body1(ast[1]) + "===" + compile_body1(ast[2]) + ")";
        case "%":
        case "==":
        case "===":
        case "!=":
        case "!==":
        case "<":
        case ">":
        case "<=":
        case ">=":
            return "(" + `to_number(${compile_body1(ast[1])})` + ast[0] + `to_number(${compile_body1(ast[2])})` + ")";
        case "&&":
        case "||":
        case "&":
        case "|":
        case "+":
        case "-":
        case "*":
        case "**":
        case "/": {
            return "(" + insert_op(ast[0], ast.slice(1)) + ")";
        }
        default:
            let fcall = compile_body1(ast[0].replaceAll(".", "_")) + "(";
            for (let i = 1; i < ast.length; i++) {
                if (i > 1)
                    fcall += ",";
                fcall += compile_body1(ast[i]);
            }
            fcall += ")";
            return fcall;
    }
}

function insert_op(op, rest) {
    if (rest.length === 1)
        //return op + compile_body1(rest[0]);
        return op + `to_number(${compile_body1(rest[0])})`;
    //let result = [compile_body1(rest[0])];
    let result = [];
    for (let i = 0; i < rest.length; i++) {
        if (i>0) result.push(op);
        result.push(`to_number(${compile_body1(rest[i])})`);
    }
    return `new_number(${result.join("")})`;
}

function compile_do(ast) {
    let ast1 = ast[1];
    let parallel = ast[0] === "do";
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
    let until_ast = parallel ? ["until", ast2[0], "#oml_root* __do__[" + ast1_len + "];", ...ast.slice(3)] : ["until", ast2[0], ...ast.slice(3)];
    if (parallel) {
        ast1.forEach((x, i) => {
            if (x.length < 3)
                return;
            let next_step = ["set!", "__do__[" + i + "]", x[2]];
            until_ast.push(next_step);
        });
        ast1.forEach((x, i) => {
            if (x.length < 3)
                return;
            let next_step = ["set!", x[0], "__do__[" + i + "]"];
            until_ast.push(next_step);
        });
    }
    else {
        ast1.forEach((x) => {
            if (x.length < 3)
                return;
            let next_step = ["set!", x[0], x[2]];
            until_ast.push(next_step);
        });
    }
    let new_ast = [parallel ? "_let" : "_let*", ast1_vars].concat([until_ast]);
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
        let result = CPP_HEAD;
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
        result += CPP_TAIL;
        return result;
    };
    return glob;
}

export function compile(text, debug) {
    let o = omlcpp();
    return o.compile(text, debug);
}
