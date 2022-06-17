#include "omscript.cpp.h"

int main()
{
    GC_INIT();
    static om_register *null = new_null();
    static om_register *undefined = new_undefined();
    auto add2=[&](om_register* a,om_register* b)
    {
        return ((*(a))+(*(b)));
    };
    print(add2(new_number(11),new_number(22)));
    auto x=new_number(123);
    print(x);

    return 0;
}
