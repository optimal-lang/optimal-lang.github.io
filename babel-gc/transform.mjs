import babel from "https://jspm.dev/@babel/standalone";

const code = `var x = 5`;
const transformed = babel.transform(code, {
  presets: ["env"],
}).code;
console.log(transformed);
