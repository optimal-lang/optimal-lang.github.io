#include "omscript.cpp.h"

int main()
{
    GC_INIT();
    static om_register *null = new_null();
    static om_register *undefined = new_undefined();
    om_register *x = new_string("abc");
    do
    {
        if (bool_value(equal(x, new_string("a"))))
        {
            print(new_string("match-a"));
            goto label1;
        }
        goto label0;
    label1:
        print(new_string("a"));
    label0:
        ;
    } while(false);
    print(new_string("END"));
    //label1:

    return 0;
}
