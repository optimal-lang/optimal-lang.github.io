%module omscript

//%include "std_except.i"

%include "std_string.i"

%include <std_shared_ptr.i>
%template(om_data) std::shared_ptr<om_register>;

%{
#include "omscript.h"
%}
 
%include "omscript.h"

%include "std_vector.i"
%include "std_map.i"
namespace std {
   //%template(IntVector) vector<int>;
   //%template(DoubleVector) vector<double>;
   //%template(StringVector) vector<string>;
   //%template(om_register_ptr_vector) vector<shared_ptr<om_register>>;
   %template(om_list_data) vector<om_register_ptr>;
   %template(om_dict_data) map<string, om_register_ptr>;
}
