#include "omlcpp.h"
#include <iostream>
#include <functional>
#include <vector>
#include <gc/gc.h>
#include <gc/gc_cpp.h>

int main()
{
    GC_INIT();
    std::function<oml_root*()> dummy2=[=]()->oml_root* {return (([=](std::function< oml_root*(oml_root*,oml_root*) > my_add2)
    {
        my_add2=[=](oml_root* a,oml_root* b)->oml_root* {return ((new_number(number_value(a)+number_value(b))));};
        return (console_log(my_add2(new_number(33),new_number(44))));
    })(0));
                                                       };
    dummy2();
    console_log((new_number(2*3)));
    console_log((new_number(2+number_value(null)+number_value(undefined)+3)));
    console_log(new_string("abc"));
    console_log(new_string(string_value(new_number(11))+string_value(undefined)+string_value(null)+std::string("2")));

    return 0;
}
