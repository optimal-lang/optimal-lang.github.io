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
   %template(om_list_data) vector<om_data>;
   %template(om_dict_data) map<string, om_data>;
}
