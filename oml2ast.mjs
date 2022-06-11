function tokenize(str) {
  let re = /[\s,]*([()\[\]{}'`]|"(?:\\.|[^\\"])*"|@(?:@@|[^@])*@|;.*|#.*|[^\s,()\[\]{}'"`;@]*)/g;
  let result = [];
  let token;
  while ((token = re.exec(str)[1]) !== "") {
    if (token[0] === ";") continue;
    if (token[0] === "#") continue;
    //if (token.match(/^-?[0-9][0-9.]*$/)) token = parseFloat(token, 10);
    if (isFinite(token)) token = parseFloat(token, 10);
    result.push(token);
  }
  return result;
}

function read_token(code, exp) {
  if (code.length === 0) return undefined;
  let token = code.shift();
  exp.push(token);
  return token;
}

function read_list(code, exp, ch) {
  let result = [];
  let ast;
  while ((ast = read_sexp(code, exp, false)) !== undefined) {
    if (ast === "]") {
      if (ch !== "[") code.unshift("]");
      break;
    } else if (ast === ")") {
      break;
    }
    result.push(ast);
  }
  return result;
}

function read_dict(code, exp) {
  let result = [["#", "dict"]];
  let ast1;
  let ast2;
  while ((ast1 = read_sexp(code, exp)) !== undefined) {
    console.log("read_dict: " + ast1)
    if (ast1 === "]") continue;
    if (ast1 === "}") break;
    ast2 = read_sexp(code, exp);
    result.push(ast1);
    result.push(ast2);
  }
  return result;
}

function read_sexp(code, exp) {
  let token = read_token(code, exp);
  if (token === undefined) return undefined;
  if ((typeof token)==="number") return token;
  switch (token) {
    case "false":
      return false;
    case "true":
      return true;
    case "null":
      return null;
    case "undefined":
      return ["@", "undefined"];
  }
  let ch = token[0];
  switch (ch) {
    case "(":
    case "[":
      let lst = read_list(code, exp, ch);
      return lst;
    case ")":
    case "]":
      return ch;
    case "{":
      return read_dict(code, exp);
    case "}":
      return ch;
    case '"':
      token = JSON.parse(token);
      return token;
    case "@":
      token = token.replace(/(^@|@$)/g, "");
      token = token.replace(/(@@)/g, "@");
      return ["@", token];
    default: {
      if (token[0]===":") return token;
      if (token[0]==="&") return token;
      let ids = token[0]==="." ? [ token ] : token.split(".");
      return ["#",...ids];
    }
  }
}

function join_sexp(exp) {
  if (exp.length === 0) return "";
  let last = exp.shift();
  let result = "" + last;
  while (exp.length > 0) {
    let token = exp.shift();
    if (
      token !== ")" &&
      token !== "]" &&
      (last !== "(") & (last !== "[") &&
      last !== "'"
    )
      result += " ";
    if (token === "[") token = "(";
    if (token === "]") token = ")";
    result += token;
    last = token;
  }
  return result;
}

export function oml2ast(text) {
  let code = tokenize(text);
  let result = [];
  while (true) {
    let exp = [];
    let ast = read_sexp(code, exp);
    if (ast === undefined) break;
    if (ast === ")") continue;
    if (ast === "]") continue;
    result.push([join_sexp(exp), ast]);
  }
  return result;
}

export function ast2oml(ast) {
  if (ast === null) return "null";
  if (ast === undefined) return "undefined";
  if ((typeof ast) === "number") return JSON.stringify(ast);
  if ((typeof ast) === "string") return JSON.stringify(ast);
  if ((typeof ast) === "boolean") return JSON.stringify(ast);
  if (ast instanceof Array) {
    let result = "( ";
    for (let i=0; i<ast.length; i++) {
      if (i>0) result += " ";
      result += ast2oml(ast[i]);
    }
    result += " )";
    return result;
  } else {
    let result = "{ ";
    let keys = Object.keys(ast);
    keys.sort();
    for (let i=0; i<keys.length; i++) {
      if (i>0) result += " ";
      result += JSON.stringify(keys[i]);
      result += " ";
      result += ast2oml(ast[keys[i]]);
    }
    result += " }";
    return result;
  }
}