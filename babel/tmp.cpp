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
    auto add3=[&](om_register* a,om_register* b,om_register* c)
    {
        return ((*(((*(a))+(*(b)))))+(*(c)));
    };
    print(add3(new_number(11),new_number(22),new_number(33)));
    auto test01=[&](om_register* a)
    {
        auto a10=((*(a))+(*(new_number(10))));
        print(a10);
        return new_number(0);
    };
    print(test01(new_number(22)));
    auto y=((*(((*(new_number(1)))+(*(new_number(2))))))+(*(new_number(3))));
    print(y);
    print(new_string("abc"));

    return 0;
}
