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
    print(((*(new_string("abc")))+(*(new_number(123)))));
    print(((*(new_string("abc")))+(*(null))));
    print(((*(new_string("abc")))+(*(undefined))));
    print(new_list(new_number(11),new_number(22),new_number(33)));
    print(new (GC) om_dict(new (GC) om_dict_data{{"a",new_number(11)},{"b",new_number(22)},{"c",new_number(33)}}));
    auto list1=new_list(new_number(11),new_number(22),new_number(33));
    auto dict=new (GC) om_dict(new (GC) om_dict_data{{"a",new_number(11)},{"b",new_number(22)},{"c",new_number(33)}});
    print(((*(list1))+(*(dict))));
    auto list2=new_list(new_number(11),new_number(22),new_number(33),new_list(new_number(44),new_number(55)));
    print(((*(list2))+(*(dict))));
    print(((*(new_number(10)))+(*(new_bool(true)))));
    print(((*(new_number(10)))+(*(new_string("abc")))));
    print(((*(new_bool(true)))+(*(new_bool(true)))));

    return 0;
}
