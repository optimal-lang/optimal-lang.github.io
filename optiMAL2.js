if (typeof module !== "undefined") {
  var code2ary = require("./code2ary");
}

function /*class*/ Compiler() {}

Compiler.prototype.put_prefix = function(token, prep_steps) {
  let result;
  switch (token[0]) {
    case "!":
      result = "toplevel." + token.substring(1);
      break;
    case "&":
      result = "glob." + token.substring(1);
      break;
    default:
      return token;
  }
  if (prep_steps) {
    let list = result.split(".");
    for (let i = 2; i < list.length; i++) {
      let exp = list.slice(0, i).join(".");
      let step = "(typeof " + exp + `!=="object"?` + exp + "={}:null)";
      prep_steps.push(step);
    }
  }
  return result;
};

Compiler.prototype.compile_body = function(ast, start) {
  if (start === ast.length - 1) return this.compile_ast(ast[start]);
  let result = "(";
  for (let i = start; i < ast.length; i++) {
    if (i > start) result += ",";
    result += this.compile_ast(ast[i]);
  }
  return result + ")";
};

Compiler.prototype.compile_ast = function(ast) {
  if (ast === undefined) return "undefined";
  if (!ast) {
    return JSON.stringify(ast);
  }
  if (typeof ast === "string") {
    if (ast.match(/^:.+$/)) return JSON.stringify(ast);
    return this.put_prefix(ast);
  }
  if (!(ast instanceof Array)) {
    return ast.toString();
  }
  if (ast.length === 0) return ast;
  switch (ast[0]) {
    case "`":
      return JSON.stringify(ast[1]);
    case "@":
      return ast[1];
    case "begin":
    case "_do":
    case "progn":
      return this.compile_body(ast, 1);
    case "case": {
      let result = "(function(){switch(" + this.compile_ast(ast[1]) + "){";
      let rest = ast.slice(2);
      rest.forEach(x => {
        let val = x[0];
        switch (val) {
          case ":else":
          case "else":
          case "otherwise":
          case ":otherwise":
            result += "default:";
            break;
          default:
            if (val instanceof Array && val[0] === "`") val = val[1];
            result += "case " + JSON.stringify(val) + ":";
        }
        let body = this.compile_body(x, 1);
        result += "return " + body + ";";
      });
      result += "}return null})()";
      return result;
    }
    case "_cond": {
      function _cond_builder(rest) {
        if (rest.length === 0) return null;
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
      return this.compile_ast(ast);
    }
    case "cond": {
      let new_ast = [];
      ast.slice(1).forEach(x => {
        new_ast.push(x[0]);
        new_ast.push(["_do"].concat(x.slice(1)));
      });
      new_ast.unshift("_cond");
      return this.compile_ast(new_ast);
    }
    case "dec!":
    case "dec":
    case "inc!":
    case "inc":
      let sign = ast[0] === "dec!" || ast[0] === "dec" ? "-" : "+";
      let val = ast.length < 3 ? 1 : this.compile_ast(ast[2]);
      return this.compile_ast(ast[1]) + sign + "=" + val;
    case "def":
    case "def!": {
      let prep_steps = [];
      let v = this.put_prefix(ast[1], prep_steps);
      if (prep_steps.length > 0) {
        return (
          prep_steps.join(",") + ",(" + v + "=" + this.compile_ast(ast[2]) + ")"
        );
      } else {
        return v + "=" + this.compile_ast(ast[2]);
      }
    }
    case "define": {
      if (ast[1] instanceof Array) {
        let new_ast = ast.slice(2);
        new_ast.unshift(ast[1].slice(1));
        new_ast.unshift("fn");
        new_ast = ["def", ast[1][0], new_ast];
        return this.compile_ast(new_ast);
      } else {
        return this.compile_ast(["def", ast[1], ast[2]]);
      }
    }
    case "do":
    case "do*":
      return this.compile_do(ast);
    case "fn":
    case "fn*":
    case "lambda": {
      let args = "(";
      for (let i = 0; i < ast[1].length; i++) {
        if (i > 0) args += ",";
        args += ast[1][i];
      }
      args += ")";
      return "function" + args + "{return " + this.compile_body(ast, 2) + "}";
    }
    case "dotimes": {
      let ast1 = ast[1];
      if (ast1.length < 2) ast1 = ["__dotimes__", ast1[0]];
      let bind = [
        ["__dotimes_cnt__", ast1[1]],
        ["__dotimes_idx__", 0, ["+", "__dotimes_idx__", 1]],
        [ast1[0], "__dotimes_idx__", "__dotimes_idx__"]
      ];
      let exit = [[">=", "__dotimes_idx__", "__dotimes_cnt__"]];
      ast = ["do*", bind, exit].concat(ast.slice(2));
      return this.compile_ast(ast);
    }
    case "if":
      return (
        "(" +
        this.compile_ast(ast[1]) +
        "?" +
        this.compile_ast(ast[2]) +
        ":" +
        this.compile_body(ast, 3) +
        ")"
      );
    case "let":
    case "let*": {
      let ast1 = ast[1];
      let new_ast1 = [];
      for (let x of ast1) {
        if (typeof x === "string") {
          new_ast1.push(x);
          new_ast1.push(undefined);
        } else {
          new_ast1.push(x[0]);
          new_ast1.push(x[1]);
        }
      }
      return this.compile_ast(["_" + ast[0], new_ast1].concat(ast.slice(2)));
    }
    case "_let":
    case "_let*": {
      let vars = "(";
      let vals = "(";
      let assigns = "";
      for (let i in ast[1]) {
        if (i % 2) {
          if (i > 1) vars += ",";
          vars += ast[1][i - 1];
          let val = this.compile_ast(ast[1][i]);
          if (i > 1) vals += ",";
          vals += val;
          assigns += ast[1][i - 1] + "=" + val + ";";
        }
      }
      vars += ")";
      vals += ")";
      if (ast[0] === "_let")
        return (
          "((function" +
          vars +
          "{return " +
          this.compile_body(ast, 2) +
          "})" +
          vals +
          ")"
        );
      else
        return (
          "((function" +
          vars +
          "{" +
          assigns +
          "return " +
          this.compile_body(ast, 2) +
          "})())"
        );
    }
    case "set!":
    case "set":
      return this.compile_ast(ast[1]) + "=" + this.compile_ast(ast[2]);
    case "throw": {
      return "(function(){throw " + this.compile_ast(ast[1]) + "})()";
    }
    case "try": {
      let result =
        "(function(){try{return " + this.compile_ast(ast[1]) + "}catch(";
      result += ast[2][1] + "){return " + this.compile_body(ast[2], 2) + "}";
      result += "})()";
      return result;
    }
    case "until":
    case "while": {
      let condition = this.compile_ast(ast[1]);
      if (ast[0] === "until") condition = "!" + condition;
      return (
        "((function(){while(" +
        condition +
        "){" +
        this.compile_body(ast, 2) +
        "}})(),null)"
      );
    }
    case "=":
      return (
        "(" + this.compile_ast(ast[1]) + "===" + this.compile_ast(ast[2]) + ")"
      );
    case "%":
    case "==":
    case "===":
    case "!=":
    case "!==":
    case "<":
    case ">":
    case "<=":
    case ">=":
      return (
        "(" + this.compile_ast(ast[1]) + ast[0] + this.compile_ast(ast[2]) + ")"
      );
    case "+":
    case "-":
    case "*":
    case "/": {
      return "(" + this.insert_op(ast[0], ast.slice(1)) + ")";
    }
    default:
      let fcall = this.compile_ast(ast[0]) + "(";
      for (let i = 1; i < ast.length; i++) {
        if (i > 1) fcall += ",";
        fcall += this.compile_ast(ast[i]);
      }
      fcall += ")";
      return fcall;
  }
};

Compiler.prototype.insert_op = function(op, rest) {
  let result = [this.compile_ast(rest[0])];
  for (let i = 1; i < rest.length; i++) {
    result.push(op);
    result.push(this.compile_ast(rest[i]));
  }
  return result.join("");
};

Compiler.prototype.compile_do = function(ast) {
  let ast1 = ast[1];
  let parallel = ast[0] === "do";
  let ast1_len = ast1.length;
  let ast1_vars = [];
  if (parallel) {
    ast1_vars.push("__do__");
    ast1_vars.push(["@", "new Array(" + ast1_len + ").fill(null)"]);
  }
  ast1.forEach((x, i) => {
    ast1_vars.push(x[0]);
    ast1_vars.push(x[1]);
  });
  let ast2 = ast[2];
  if (ast2.length < 2) ast2 = [ast2[0], null];
  let until_ast = ["until", ast2[0]].concat(ast.slice(3));
  if (parallel) {
    ast1.forEach((x, i) => {
      if (x.length < 3) return;
      let next_step = ["set!", ["@", "__do__[" + i + "]"], x[2]];
      until_ast.push(next_step);
    });
    ast1.forEach((x, i) => {
      if (x.length < 3) return;
      let next_step = ["set!", x[0], ["@", "__do__[" + i + "]"]];
      until_ast.push(next_step);
    });
  } else {
    ast1.forEach((x, i) => {
      if (x.length < 3) return;
      let next_step = ["set!", x[0], x[2]];
      until_ast.push(next_step);
    });
  }
  let new_ast = [parallel ? "_let" : "_let*", ast1_vars].concat([until_ast]);
  new_ast.push(ast2[1]);
  return this.compile_ast(new_ast);
};

var $comp$ = new Compiler();

function optiMAL(toplevel) {
  let glob = Object.create(toplevel);
  let $isNode$ = typeof process !== "undefined";
  glob.compile_ast_d = ast => glob.compile_ast(ast, true);
  glob.compile_ast = (ast, debug) => {
    if (debug) console.log(" [AST] " + JSON.stringify(ast));
    let text = $comp$.compile_ast(ast);
    if (debug) console.log("[CODE] " + text);
    return text;
  };
  glob.compile_d = text => glob.compile(text, true);
  glob.compile = (text, debug) => {
    let steps = code2ary(text);
    let result = "";
    for (let step of steps) {
      let exp = step[0];
      let ast = step[1];
      if (debug) console.log("[LIST] " + exp);
      if (debug) console.log(" [AST] " + JSON.stringify(ast));
      let text = $comp$.compile_ast(ast);
      if (debug) console.log("[CODE] " + text);
      result += text + ";\n";
    }
    return result;
  };
  glob.load_d = path => glob.load(path, true);
  glob.load = (path, debug) => {
    let src = null;
    if ($isNode$) {
      src = require("fs").readFileSync(path);
    } else {
      let request = new XMLHttpRequest();
      request.open("GET", path, false);
      request.send(null);
      if (request.status === 200) {
        src = request.responseText;
      }
    }
    if (src === null) console.log("Could not read: " + path);
    return glob.exec(src, debug);
  };
  glob.run = exp => glob.exec(exp, true);
  glob.exec_d = exp => glob.exec(exp, true);
  glob.exec = (exp, debug) => {
    let src = exp;
    let steps = code2ary(src);
    let last;
    for (let step of steps) {
      let exp = step[0];
      let ast = step[1];
      var tm1 = new Date().getTime();
      try {
        if (debug) console.log("[LIST] " + exp);
        if (debug) console.log(" [AST] " + JSON.stringify(ast));
        let text = $comp$.compile_ast(ast);
        if (debug) console.log("[CODE] " + text);
        let val = eval(text);
        last = val;
        let output;
        if (typeof val === "function") {
          output = "function";
        } else if (
          !(val instanceof Array) &&
          val instanceof Object &&
          Object.prototype.toString.call(val) !== "[object Object]"
        ) {
          try {
            output =
              Object.prototype.toString.call(val) + " " + JSON.stringify(val);
          } catch (e) {}
        } else {
          try {
            output = JSON.stringify(val);
          } catch (e) {}
        }
        var tm2 = new Date().getTime();
        if (debug) {
          if (output === undefined) {
            console.log("==> (" + (tm2 - tm1) + " ms)");
            console.log(val);
          } else {
            console.log("==> " + output + " (" + (tm2 - tm1) + " ms)");
          }
        }
      } catch (e) {
        if (!debug) console.log("[LIST] " + exp);
        if (!debug) console.log(" [AST] " + JSON.stringify(ast));
        if (!debug) console.log("[CODE] " + text);
        console.log(" [EXCEPTION]");
        if (e.stack) console.log(e.stack);
        else console.log(e);
        /*if(!debug)*/ throw(e);
        break;
      }
    }
    return last;
  };
  return glob;
}

if (typeof module !== "undefined") module.exports = optiMAL;
