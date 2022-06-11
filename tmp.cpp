#include "omlcpp.h"

int main()
{
    GC_INIT();
    std::function<oml_root*(oml_root*,oml_root*)> add2=[&](oml_root* a,oml_root* b)->oml_root* {return ((new_number(number_value(a)+number_value(b))));};
    print(add2(new_number(11),new_number(22)));
    print((new_number(5*number_value((new_number(2+3)))*10)));
    oml_root* x=add2(new_number(100),new_number(23));
    std::function<oml_root*(oml_root*)> add_x=[&](oml_root* n)->oml_root* {return ((new_number(number_value(n)+number_value(x))));};
    print(add_x(new_number(10)));
    print(([&](oml_root* x,oml_root* y)
    {
        x=new_number(11);
        y=new_number(22);
        return ((new_number(number_value(x)+number_value(y))));
    })(0,0));
    print(([&](oml_root* x,oml_root* y)
    {
        x=new_number(11);
        y=new_number(22);
        return ((new_number(number_value(x)+number_value(y))));
    })(0,0));
    std::function<oml_root*(oml_root*)> fact=[&](oml_root* x)->oml_root* {return (([&](oml_root* n,oml_root* rlt)
    {
        n=new_number(2);
        rlt=new_number(1);
        return ((([&]()->void {while(!(number_value(x)<number_value(n)))
    {
        (rlt=(new_number(number_value(rlt)*number_value(n))),n=(new_number(1+number_value(n))));
        }})(),0),rlt);
    })(0,0));
                                                                         };
    print(fact(new_number(4)));
    std::function<oml_root*(oml_root*)> fact2=[&](oml_root* x)->oml_root* {return (([&](oml_root* n,oml_root* rlt)
    {
        n=new_number(2);
        rlt=new_number(1);
        return ((([&]()->void {while(!(number_value(x)<number_value(n)))
    {
        oml_root* __do__[2];
            (rlt=(new_number(number_value(rlt)*number_value(n))),__do__[0]=(new_number(1+number_value(n))),n=__do__[0]);
        }})(),0),rlt);
    })(0,0));
                                                                          };
    print(fact2(new_number(4)));
    std::function<oml_root*()> dummy1=[&]()->oml_root* {return (([&](oml_root* a)
    {
        a=new_number(22);
        return (([&](oml_root* b)
        {
            b=new_number(33);
            return (print((new_number(number_value(a)+number_value(b)))));
        })(0));
    })(0));
                                                       };
    dummy1();
    std::function<oml_root*()> dummy2=[&]()->oml_root* {return (([&](std::function<oml_root*(oml_root*,oml_root*)> my_add2)
    {
        my_add2=[&](oml_root* a,oml_root* b)->oml_root* {return ((new_number(number_value(a)+number_value(b))));};
        return (print(my_add2(new_number(33),new_number(44))));
    })(0));
                                                       };
    dummy2();
    print((new_number(2*3)));
    print((new_number(2+number_value(null)+number_value(undefined)+3)));
    print(new_string("abc"));
    print(new_string(string_value(new_number(11))+string_value(undefined)+string_value(null)+std::string("22")));
    print((new_number(11+number_value(undefined)+number_value(null)+number_value(new_string("22")))));
    print(new_string("abc\nxyz"));
    print(new_string(string_value(new_number(11))+string_value(undefined)+string_value(null)+std::string("22")));
    print((bool_value(bool_value(new_string("abc")))?new_string("ok"):(new_string("ng"))));
    print((bool_value(bool_value(new_string("")))?new_string("ok"):(new_string("ng"))));
    print((bool_value(bool_value(new_string("")))?new_string("ok"):(new_string("ng"))));
    print((bool_value(bool_value((1<2)))?new_string("ok"):(new_string("ng"))));
    print((bool_value(bool_value(new_number(1)))?new_string("ok"):(new_string("ng"))));
    print((bool_value(bool_value(new_number(0)))?new_string("ok"):(new_string("ng"))));
    (([&](oml_root* x)
    {
        x=new_number(20);
        return (print(new_list(new (GC) oml_list_data {new_number(1),x,new_number(3)})));
    })(0));
    print(new_dict(new (GC) oml_dict_data {{new_string(":key1"),new_number(123)},{new_string(":key2"),new_list(new (GC) oml_list_data {new_string("abc"),undefined,new_bool(true),new_bool(false)})}}));
    print((bool_value(true)?new_string("ok"):(new_string("ng"))));
    print((bool_value(false)?new_string("ok"):(new_string("ng"))));

    return 0;
}
