#! bash -uvx
set -e
swig -c++ -d -d2 omscript.i
sed -i -e 's/package struct SwigPendingException/struct SwigPendingException/g' omscript_im.d
mingw32x g++ -o omscript_wrap.dll -shared omscript.cpp omscript_wrap.cxx -static
dmd -m32omf main.d omscript.d omscript_im.d -L/subsystem:console -ofmain.exe
./main.exe
