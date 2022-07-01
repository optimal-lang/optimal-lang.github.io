%module omscript

//%include "std_except.i"

%include "std_string.i"

%include <std_shared_ptr.i>

%template(om_register_ptr) std::shared_ptr<om_register>;

%{
#include "omscript.h"
%}
 
%include "omscript.h"

%include "std_vector.i"
namespace std {
   //%template(IntVector) vector<int>;
   //%template(DoubleVector) vector<double>;
   //%template(StringVector) vector<string>;
   %template(RegisterPtrVector) vector<shared_ptr<om_register>>;
}
