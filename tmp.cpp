#include "omlcpp.h"
#include <iostream>
#include <functional>
#include <vector>
#include <gc/gc.h>
#include <gc/gc_cpp.h>

int main()
{
    GC_INIT();
    console_log(new_number(123));
    oml_root* n=new_number(777);
    console_log(n);
    std::function<oml_root*(oml_root*,oml_root*)> add2=[=](oml_root* a,oml_root* b)->oml_root* {return ((new_number(number_value(a)+number_value(b))));};
    console_log(add2(new_number(11),new_number(22)));
    console_log((new_number(number_value(n)+12)));

    return 0;
}
