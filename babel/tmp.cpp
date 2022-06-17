#include "omlcpp.h"

int main()
{
    GC_INIT();
    static oml_register *null = new_null();
    static oml_register *undefined = new_undefined();
    auto add2=[&](oml_register* a,oml_register* b)
    {
        return new_register((number_value(a)+number_value(b)));
    };
    print(add2(new_register((double)11),new_register((double)22)));
    auto x=new_register((double)123);
    print(x);
    auto add3=[&](oml_register* a,oml_register* b,oml_register* c)
    {
        return new_register(((number_value(a)+number_value(b))+number_value(c)));
    };
    print(add3(new_register((double)11),new_register((double)22),new_register((double)33)));
    auto test01=[&](oml_register* a)
    {
        auto a10=new_register((number_value(a)+(double)10));
        print(a10);
        return new_register((double)0);
    };
    print(test01(new_register((double)22)));
    auto y=new_register((((double)1+(double)2)+(double)3));
    print(y);

    return 0;
}
