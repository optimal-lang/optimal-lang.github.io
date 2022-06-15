// https://github.com/harc/ohm/blob/master/doc/README.md

import ohm from 'https://unpkg.com/ohm-js@16/dist/ohm.esm.js';

// Instantiate the grammar.
//const g = ohm.grammar(Deno.readTextFileSync("es5.ohm"));
const g = ohm.grammars(Deno.readTextFileSync("es5.ohm")+"\n"+Deno.readTextFileSync("es6.ohm"))["ES6"];

const match = g.match('1 + (2 - 3) + 4');
console.log(match.succeeded());
