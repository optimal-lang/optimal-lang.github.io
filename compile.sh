#! bash
set -uvx
set -e
deno run --allow-all compile1.mjs | tee compile1.txt
sleep 3
deno run --allow-all compile2.mjs
astyle --style=allman tmp.cpp
cat tmp.cpp
#mingwx.cmd g++.exe tmp.cpp -static -lgc -lgccpp
g++.exe tmp.cpp -static -lgc -lgccpp
./a.exe | tee compile2.txt
dos2unix compile1.txt compile2.txt
diff compile1.txt compile2.txt
