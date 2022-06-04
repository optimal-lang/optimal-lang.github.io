#include "omlcpp.h"
#include <iostream>
#include <functional>
#include <vector>
#include <gc/gc.h>
#include <gc/gc_cpp.h>

int main()
{
    GC_INIT();
    static std::function< oml_root*(oml_root*,oml_root*) > add2 = [=](oml_root* a,oml_root* b)->oml_root* {return ((new_number(number_value(a)+number_value(b))));};
    console_log(add2(new_number(11),new_number(22)));
    console_log((new_number(5*number_value((new_number(2+3)))*10)));
    static oml_root* x = add2(new_number(100),new_number(23));
    static std::function< oml_root*(oml_root*) > add_x = [=](oml_root* n)->oml_root* {return ((new_number(number_value(n)+number_value(x))));};
    console_log(add_x(new_number(10)));
    console_log(([=](oml_root* x,oml_root* y)
    {
        return ((new_number(number_value(x)+number_value(y))));
    })(new_number(11),new_number(22)));
    console_log(([=](oml_root* x,oml_root* y)
    {
        x=new_number(11);
        y=new_number(22);
        return ((new_number(number_value(x)+number_value(y))));
    })(0,0));
    static std::function< oml_root*(oml_root*) > fact = [=](oml_root* x)->oml_root* {return (([=](oml_root* n,oml_root* rlt)
    {
        n=new_number(2);
        rlt=new_number(1);
        return ((([&]()->void {while(!(number_value(x)<number_value(n)))
    {
        (rlt=(new_number(number_value(rlt)*number_value(n))),n=(new_number(1+number_value(n))));
        }})(),0),rlt);
    })(0,0));
                                                                                    };
    console_log(fact(new_number(4)));
    static std::function< oml_root*(oml_root*) > fact2 = [=](oml_root* x)->oml_root* {return (([=](oml_root* n,oml_root* rlt)
    {
        return ((([&]()->void {while(!(number_value(x)<number_value(n)))
    {
        oml_root* __do__[2];
            (rlt=(new_number(number_value(rlt)*number_value(n))),__do__[0]=(new_number(1+number_value(n))),n=__do__[0]);
        }})(),0),rlt);
    })(new_number(2),new_number(1)));
                                                                                     };
    console_log(fact2(new_number(4)));
    static std::function< oml_root*() > dummy1 = [=]()->oml_root* {return (([=](oml_root* a)
    {
        a=new_number(22);
        return (([=](oml_root* b)
        {
            b=new_number(33);
            return (console_log((new_number(number_value(a)+number_value(b)))));
        })(0));
    })(0));
                                                                  };
    dummy1();
    static std::function< oml_root*() > dummy2 = [=]()->oml_root* {return (([=](std::function< oml_root*(oml_root*,oml_root*) > my_add2)
    {
        my_add2=[=](oml_root* a,oml_root* b)
        {
            return ((new_number(number_value(a)+number_value(b))));
        };
        return (console_log(my_add2(new_number(33),new_number(44))));
    })(0));
                                                                  };
    dummy2();
    console_log((new_number(2*3)));
    console_log((new_number(2+number_value(nullptr)+number_value(undefined)+3)));
    console_log(new_string("abc"));
    console_log(new_string(string_value(new_number(11))+string_value(undefined)+string_value(nullptr)+std::string("22")));
    console_log((new_number(11+number_value(undefined)+number_value(nullptr)+number_value(new_string("22")))));
    console_log(new_string("abc\nxyz"));
    print(new_string(string_value(new_number(11))+string_value(undefined)+string_value(nullptr)+std::string("22")));

    return 0;
}
