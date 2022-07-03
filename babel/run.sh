#! bash -uvx
set -e
rm -rf omscript_wrap.cxx omscript_wrap.h omscript.d omscript_im.d
swig -c++ -d -d2 omscript.i
sed -i -e 's/package struct SwigPendingException/struct SwigPendingException/g' omscript_im.d
sed -i -e 's/private bool swigIsMethodOverridden(DelegateType, FunctionType, alias fn)() const/private bool swigIsMethodOverridden(DelegateType, FunctionType, alias fn)()/g' omscript.d
mingw32x g++ -o omscript_wrap.dll -shared omscript.cpp omscript_wrap.cxx -static
dmd -m32omf main.d omscript.d omscript_im.d -L/subsystem:console -ofmain.exe
./main.exe
