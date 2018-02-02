function put_prefix(token, prep_steps) {
  let result;
  switch(token[0]) {
    case "!":
      result = "toplevel." + token.substring(1);
      break;
    case "&":
      result = "glob." + token.substring(1);
      break;
    default:
      return token;
  }
  if(prep_steps) {
    let list = result.split(".");
    for(let i=2; i<list.length; i++) {
      let exp = list.slice(0, i).join(".");
      let step = "(typeof " + exp + `!=="object"?` + exp + "={}:null)";
      prep_steps.push(step);
    }
  }
  return result;
}

function compile_body(ast, start) {
  if (start === ast.length - 1) return compile_ast(ast[start]);
  let result = "(";
  for (let i = start; i < ast.length; i++) {
    if (i > start) result += ",";
    result += compile_ast(ast[i]);
  }
  return result + ")";
}

function compile_ast(ast) {
  if (ast === undefined) return "undefined";
  if (!ast) {
    return JSON.stringify(ast);
  }
  if (typeof ast === "string") {
    if (ast.match(/^:.+$/)) return JSON.stringify(ast);
    return put_prefix(ast);
  }
  if (!(ast instanceof Array)) {
    //console.log(ast);
    //console.log(typeof ast);
    return ast.toString();
    //return JSON.stringify(ast);
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
      return compile_body(ast, 1);
    case "_cond": {
      function _cond_builder(rest) {
        //console.log(rest);
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
      //console.log(ast);
      return compile_ast(ast);
    }
    case "cond": {
      let new_ast = [];
      ast.slice(1).forEach(x => {
        //console.log(x);
        new_ast.push(x[0]);
        new_ast.push(["_do"].concat(x.slice(1)));
      });
      new_ast.unshift("_cond");
      //console.log(new_ast);
      return compile_ast(new_ast);
    }
    case "dec!":
    case "dec":
    case "inc!":
    case "inc":
      let sign = ast[0] === "dec!" || ast[0] === "dec" ? "-" : "+";
      let val = ast.length < 3 ? 1 : compile_ast(ast[2]);
      return compile_ast(ast[1]) + sign + "=" + val;
    case "def":
    case "def!": {
      //return compile_ast(ast[1]) + "=" + compile_ast(ast[2]);
      let prep_steps = [];
      let v = put_prefix(ast[1], prep_steps);
      if(prep_steps.length>0) {
        return prep_steps.join(",") + ",(" + v + "=" +  compile_ast(ast[2]) + ")";
      } else {
        return v + "=" + compile_ast(ast[2]);
      }
    }
    case "define": {
      if (ast[1] instanceof Array) {
        let new_ast = ast.slice(2);
        new_ast.unshift(ast[1].slice(1));
        new_ast.unshift("fn");
        new_ast = ["def", ast[1][0], new_ast];
        //console.log(new_ast);
        return compile_ast(new_ast);
      } else {
        return compile_ast(["def", ast[1], ast[2]]);
      }
    }
    case "do":
    case "do*":
      return compile_do(ast);
    case "fn":
    case "fn*":
    case "lambda": {
      let args = "(";
      for (let i = 0; i < ast[1].length; i++) {
        if (i > 0) args += ",";
        args += ast[1][i];
      }
      args += ")";
      return (
        "function" + args + "{return " + compile_body(ast, 2) + "}"
      );
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
      //console.log(ast);
      return compile_ast(ast);
    }
    case "if":
      return (
        "(" +
        compile_ast(ast[1]) +
        "?" +
        compile_ast(ast[2]) +
        ":" +
        compile_body(ast, 3) +
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
      //console.log(new_ast1);
      return compile_ast(["_" + ast[0], new_ast1].concat(ast.slice(2)));
    }
    case "_let":
    case "_let*": {
      let vars = "(";
      let vals = "(";
      let assigns = "";
      for (let i in ast[1]) {
        if (i % 2) {
          //console.log(ast[1][i - 1]);
          if (i > 1) vars += ",";
          vars += ast[1][i - 1];
          let val = compile_ast(ast[1][i]);
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
          compile_body(ast, 2) +
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
          compile_body(ast, 2) +
          "})())"
        );
    }
    case "set!":
    case "set":
      return compile_ast(ast[1]) + "=" + compile_ast(ast[2]);
    case "until":
    case "while": {
      // ((function(){while(i<5){i++,console.log(i)}})(),null)
      let condition = compile_ast(ast[1]);
      if (ast[0] === "until") condition = "!" + condition;
      return (
        "((function(){while(" +
        condition +
        "){" +
        compile_body(ast, 2) +
        "}})(),null)"
      );
    }
    case "=":
      return (
        "(" +
        compile_ast(ast[1]) +
        "===" +
        compile_ast(ast[2]) +
        ")"
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
        "(" +
        compile_ast(ast[1]) +
        ast[0] +
        compile_ast(ast[2]) +
        ")"
      );
    case "+":
    case "-":
    case "*":
    case "/": {
      function insert_op(op, rest) {
        let result = [compile_ast(rest.shift())];
        while (rest.length > 0) {
          result.push(op);
          result.push(compile_ast(rest.shift()));
        }
        return result.join("");
      }
      return "(" + insert_op(ast[0], ast.slice(1)) + ")";
    }
    default:
      let fcall = compile_ast(ast[0]) + "(";
      for (let i = 1; i < ast.length; i++) {
        if (i > 1) fcall += ",";
        fcall += compile_ast(ast[i]);
      }
      fcall += ")";
      return fcall;
  }
}

function compile_do(ast) {
  let ast1 = ast[1];
  let parallel = ast[0] === "do";
  //console.log("parallel="+parallel);
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
  //console.log(new_ast);
  return compile_ast(new_ast);
}

if(typeof module !== "undefined")  module.exports = compile_ast;
