#include "omscript.cpp.h"

int main()
{
    GC_INIT();
    static om_register *null = new_null();
    static om_register *undefined = new_undefined();
    om_register* add2= new_func([&](om_list_data __arguments__)->om_register* {om_register* a=get_arg(__arguments__, 0); om_register* b=get_arg(__arguments__, 1); {{return ((*(a))+(*(b)));} return undefined;}});
    (*print)({(*add2)({new_number(11),new_number(22)})});
    auto x=new_number(123);
    (*print)({x});
    auto add3=new_func([&](om_list_data __arguments__)->om_register* {om_register* a=get_arg(__arguments__, 0); om_register* b=get_arg(__arguments__, 1); om_register* c=get_arg(__arguments__, 2); {{return ((*(((*(a))+(*(b)))))+(*(c)));} return undefined;}});
    (*print)({(*add3)({new_number(11),new_number(22),new_number(33)})});
    om_register* test01= new_func([&](om_list_data __arguments__)->om_register* {om_register* a=get_arg(__arguments__, 0); {{auto a10=((*(a))+(*(new_number(10)))); (*print)({a10});} return undefined;}});
    (*print)({(*test01)({new_number(22)})});
    auto y=((*(((*(new_number(1)))+(*(new_number(2))))))+(*(new_number(3))));
    (*print)({y});
    (*print)({new_string("abc")});
    (*print)({((*(new_string("abc")))+(*(new_number(123))))});
    (*print)({((*(new_string("abc")))+(*(null)))});
    (*print)({((*(new_string("abc")))+(*(undefined)))});
    (*print)({new_list({new_number(11),new_number(22),new_number(33)})});
    (*print)({new_dict({{"a",new_number(11)},{"b",new_number(22)},{"c",new_number(33)}})});
    auto list1=new_list({new_number(11),new_number(22),new_number(33)});
    auto dict=new_dict({{"a",new_number(11)},{"b",new_number(22)},{"c",new_number(33)}});
    (*print)({((*(list1))+(*(dict)))});
    auto list2=new_list({new_number(11),new_number(22),new_number(33),new_list({new_number(44),new_number(55)})});
    (*print)({((*(list2))+(*(dict)))});
    (*print)({((*(new_number(10)))+(*(new_bool(true))))});
    (*print)({((*(new_number(10)))+(*(new_string("abc"))))});
    (*print)({((*(new_bool(true)))+(*(new_bool(true))))});
    (*print)({((*(null))+(*(undefined)))});
    (*print)({((*(undefined))+(*(null)))});
    (*print)({((*(new_string("abc")))+(*(null)))});
    (*print)({((*(null))+(*(new_string("abc"))))});
    (*print)({((*(null))+(*(new_number(0))))});
    (*print)({add2});
    auto abc=new_number(1);
    (*print)({new_string(std::string("ABC+1: ")+string_value(((*(abc))+(*(new_number(1)))))+std::string(""))});
    (*print)({new_string(std::string("test: ")+string_value(((*((*add2)({new_number(11),new_number(22)})))+(*(new_number(1)))))+std::string(""))});
    auto s=new_string("AB");
    {
        {
            om_register *__switch1__=((*(s))+(*(new_string("C"))));
            if(eq(__switch1__,new_string("ABC"))) goto __label4__;
            if(eq(__switch1__,new_string("XYZ"))) goto __label5__;
            goto __default2__;
__label4__:
            ;
            (*print)({new_string("abc")});
__label5__:
            ;
            {
                (*print)({new_string("xyz")});
                goto __break3__;
            };
__default2__:
            ;
            {
                (*print)({new_string("default")});
            };
        }
__break3__:
        ;
    };
    s=new_string("XYZ");
    (*print)({s});
    list1=new_list({new_number(11),new_number(22),new_number(33)});
    dict=new_dict({{"a",new_number(11)},{"b",new_number(22)},{"c",new_number(33)}});
    (*print)({(*list1)[new_number(1)]});
    (*list1)[new_number(1)]=new_number(222);
    (*print)({list1});

    return 0;
}
