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

    return 0;
}
