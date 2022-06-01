#! bash -uvx
set -e
deno run --allow-all compile.mjs
deno fmt tmp.js
cat tmp.js
deno run --check tmp.js
astyle --style=allman tmp.cpp
cat tmp.cpp
mingwx.cmd g++.exe tmp.cpp
./a.exe
