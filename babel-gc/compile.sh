#! bash -uvx
set -e
rm -rf compile1.txt compile2.txt
deno run --allow-all omscript.js.mjs | tee compile1.txt
deno run --allow-all omscript.cpp.mjs
astyle --style=allman tmp.cpp
cat tmp.cpp
#mingwx.cmd g++.exe tmp.cpp -static -lgc -lgccpp
mingwx mk.mgw tmp.pro
./tmp-x86_64-static.exe | tee compile2.txt
dos2unix compile1.txt compile2.txt
diff compile1.txt compile2.txt
