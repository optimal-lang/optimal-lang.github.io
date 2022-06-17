#include "omlcpp.h"

int main()
{
    GC_INIT();
    static oml_register *null = new_null();
    static oml_register *undefined = new_undefined();
    auto add2=[&](oml_register* a,oml_register* b)
    {
        return new_root((number_value(a)+number_value(b)));
    };
    print(add2(new_root(((double)11)),new_root(((double)22))));
    auto x=new_root(((double)123));
    print(x);
    auto add3=[&](oml_register* a,oml_register* b,oml_register* c)
    {
        return new_root(((number_value(a)+number_value(b))+number_value(c)));
    };
    print(add3(new_root(((double)11)),new_root(((double)22)),new_root(((double)33))));
    auto test01=[&](oml_register* a)
    {
        auto a10=new_root((number_value(a)+((double)10)));
        print(a10);
        return new_root(((double)0));
    };
    print(test01(new_root(((double)22))));

    return 0;
}
