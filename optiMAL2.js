//var code2ary = require("./code2ary");
//var compile_ast = require("./compile_ast");
if(typeof module !== "undefined") {
  var code2ary = require("./code2ary");
  var compile_ast = require("./compile_ast");
  var miniMAL = require("./miniMAL");
}

function optiMAL(E) {
  let glob = miniMAL(E);
  let toplevel = E;
  glob.DEMO = exp => glob.EVAL(exp, true);
  glob.EVAL = (exp, debug) => {
    let src = exp;
    let steps = code2ary(src);
    let last;
    for (let step of steps) {
      let exp = step[0];
      let ast = step[1];
      var tm1 = new Date().getTime();
      try {
        if (debug) console.log("[EVAL] " + exp);
        if (debug) console.log(" [AST] " + JSON.stringify(ast));
        let val = glob.eval(ast);
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
          } catch(e) {}
        } else {
          try {
            output = JSON.stringify(val);
          } catch(e) {}
        }
        var tm2 = new Date().getTime();
        if (debug) {
          if(output===undefined) {
            console.log("==> (" + (tm2 - tm1) + " ms)");
            console.log(val);
          } else {
            console.log("==> " + output + " (" + (tm2 - tm1) + " ms)");
          }
        }
      } catch (e) {
        if (!debug) console.log("[EVAL] " + exp);
        if (!debug) console.log(" [AST] " + JSON.stringify(ast));
        console.log(" [EXCEPTION]");
        if (e.stack) console.log(e.stack);
        else console.log(e);
        break;
      }
    }
    return last;
  };
  glob.LOAD = (path, debug) => {
    let src = require("fs").readFileSync(path);
    return glob.EVAL(src, debug);
  };
  glob.RUN = exp => glob.EXEC(exp, true);
  glob.EXEC = (exp, debug) => {
    let src = exp;
    let steps = code2ary(src);
    let last;
    for (let step of steps) {
      let exp = step[0];
      let ast = step[1];
      var tm1 = new Date().getTime();
      try {
        if (debug) console.log("[COMPILE] " + exp);
        if (debug) console.log("    [AST] " + JSON.stringify(ast));
        let text = compile_ast(ast);
        if (debug) console.log("[COMPILED] " + text);
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
          } catch(e) {}
        } else {
          try {
            output = JSON.stringify(val);
          } catch(e) {}
        }
        var tm2 = new Date().getTime();
        if (debug) {
          if(output===undefined) {
            console.log("==> (" + (tm2 - tm1) + " ms)");
            console.log(val);
          } else {
            console.log("==> " + output + " (" + (tm2 - tm1) + " ms)");
          }
        }
      } catch (e) {
        if (!debug) console.log("[COMPILE] " + exp);
        if (!debug) console.log("    [AST] " + JSON.stringify(ast));
        console.log(" [EXCEPTION]");
        if (e.stack) console.log(e.stack);
        else console.log(e);
        break;
      }
    }
    return last;
  };
  return glob;
}

if(typeof module !== "undefined") module.exports = optiMAL;
