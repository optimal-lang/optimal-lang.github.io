function tokenize_regexp() {
  return /[\s,]*([()\[\]'`]|"(?:\\.|[^\\"])*"|@(?:@@|[^@])*@|;.*|[^\s,()\[\]'"`;@]*)/g;
  //return new RegExp("[\\s,]*([()\\[\\]'`]|\"(?:\\\\.|[^\\\\\"])*\"|@(?:@@|[^@])*@|;.*|[^\\s,()\\[\\]'\"`;@]*)", "g");
}

function tokenize(str) {
  let re = tokenize_regexp();
  let result = [];
  let token;
  while ((token = re.exec(str)[1]) !== "") {
    if (token[0] === ";") continue;
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
  while ((ast = read_sexp(code, exp)) !== undefined) {
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

function read_sexp(code, exp) {
  let token = read_token(code, exp);
  if (token === undefined) return undefined;
  let ch = token[0];
  switch (ch) {
    case "(":
    case "[":
      let lst = read_list(code, exp, ch);
      return lst;
    case ")":
    case "]":
      return ch;
    case "'":
      let ast = read_sexp(code, exp);
      return ["`", ast];
    case '"':
      token = JSON.parse(token);
      return ["`", token];
    case "@":
      token = token.replace(/(^@|@$)/g, "");
      token = token.replace(/(@@)/g, "@");
      return ["@", token];
    case "#":
      return token;
    default:
      //if (isFinite(token)) return ["@", token];
      return token;
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
      last !== "(" &&
      last !== "[" &&
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

export function code2ary(text: string) {
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
