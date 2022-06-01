deno run --allow-all compile.mjs
deno fmt tmp.js
cat tmp.js
deno run tmp.js
astyle --style=allman tmp.cpp
cat tmp.cpp
rem clang++ -std=c++17 tmp.cpp
rem %MSYS2_DIR%\mingw64\bin\g++ -std=c++17 tmp.cpp
rem %MSYS2_DIR%\mingw64\bin\g++.exe tmp.cpp
call mingwx g++.exe tmp.cpp
a.exe
