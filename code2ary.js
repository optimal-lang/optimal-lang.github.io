function tokenize(str) {
  let re = /[\s,]*([()\[\]'`]|"(?:\\.|[^\\"])*"|@(?:@@|[^@])*@|;.*|[^\s,()\[\]'"`;@]*)/g;
  let result = [];
  let token;
  while ((token = re.exec(str)[1]) !== "") {
    if (token[0] === ";") continue;
    if (token.match(/^-?[0-9][0-9.]*$/)) token = parseFloat(token, 10);
    result.push(token);
  }
  return result;
};

function read_token(code, exp) {
  if (code.length === 0) return undefined;
  let token = code.shift();
  exp.push(token);
  return token;
};

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
};

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
      /*
      console.log(token);
      token = token.replace(/(\|\|)|(\|[^|])/g, function(m) {
        if(m==="||") return "|";
        return "\\" + m.substring(1);
      });
      */
      token = JSON.parse(token);
      //return ["`", token.replace(/(^"|"$)/g, "")];
      return ["`", token];
    case "@":
      token = token.replace(/(^@|@$)/g, "");
      token = token.replace(/(@@)/g, "@");
      /*
      let re;
      if ((re = token.match(/(\/(?:\\\/|[^/])*\/)([a-z]*)/))) {
        let re1 = re[1].replace(/(^\/|\/$)/g, "");
        return re[2] === ""
          ? ["RegExp", ["`", re1]]
          : ["RegExp", ["`", re1], ["`", re[2]]];
      }
      return JSON.parse(token);
      */
      return ["@", token];
    case "#":
      switch (token) {
        case "#null":
        case "#nil":
        case "#n":
          return null;
        case "#false":
        case "#f":
          return false;
        case "#true":
        case "#t":
          return true;
      }
      return token;
    default:
      return token;
  }
};

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
    result += token;
    last = token;
  }
  return result;
};

function code2ary(text) {
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
};

if(typeof module !== "undefined") module.exports = code2ary;
