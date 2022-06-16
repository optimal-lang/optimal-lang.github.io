#include "omlcpp.h"

int main()
{
    GC_INIT();
    static oml_root *null = new_null();
    static oml_root *undefined = new_undefined();
    std::function<oml_root*(oml_root*,oml_root*)> add2=[&](oml_root* a,oml_root* b)
    {
        return new_root((number_value(a)+number_value(b)));
    };
    print(add2(new_root(((double)11)),new_root(((double)22))));

    return 0;
}
