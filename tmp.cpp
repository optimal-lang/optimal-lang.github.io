#include "omlcpp.h"
#include <iostream>
#include <functional>
#include <vector>
#include <gc/gc.h>
#include <gc/gc_cpp.h>

int main()
{
    GC_INIT();
    static std::function< oml_root*(oml_root*,oml_root*) > add2 = [=](oml_root* a,oml_root* b)->oml_root* {return ((new_number(to_number(a)+to_number(b))));};
    console_log(add2(new_number(11),new_number(22)));
    console_log((new_number(to_number(new_number(5))*to_number((new_number(to_number(new_number(2))+to_number(new_number(3)))))*to_number(new_number(10)))));
    static oml_root* x = add2(new_number(100),new_number(23));
    static std::function< oml_root*(oml_root*) > add_x = [=](oml_root* n)->oml_root* {return ((new_number(to_number(n)+to_number(x))));};
    console_log(add_x(new_number(10)));
    console_log(([=](oml_root* x,oml_root* y)
    {
        return ((new_number(to_number(x)+to_number(y))));
    })(new_number(11),new_number(22)));
    console_log(([=](oml_root* x,oml_root* y)
    {
        x=new_number(11);
        y=new_number(22);
        return ((new_number(to_number(x)+to_number(y))));
    })(0,0));
    static std::function< oml_root*(oml_root*) > fact = [=](oml_root* x)->oml_root* {return (([=](oml_root* n,oml_root* rlt)
    {
        n=new_number(2);
        rlt=new_number(1);
        return ((([&]()->void {while(!(to_number(x)<to_number(n)))
    {
        (rlt=(new_number(to_number(rlt)*to_number(n))),n=(new_number(to_number(new_number(1))+to_number(n))));
        }})(),0),rlt);
    })(0,0));
                                                                                    };
    console_log(fact(new_number(4)));
    static std::function< oml_root*(oml_root*) > fact2 = [=](oml_root* x)->oml_root* {return (([=](oml_root* n,oml_root* rlt)
    {
        return ((([&]()->void {while(!(to_number(x)<to_number(n)))
    {
        oml_root* __do__[2];
            (rlt=(new_number(to_number(rlt)*to_number(n))),__do__[0]=(new_number(to_number(new_number(1))+to_number(n))),n=__do__[0]);
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
            return (console_log((new_number(to_number(a)+to_number(b)))));
        })(0));
    })(0));
                                                                  };
    dummy1();
    static std::function< oml_root*() > dummy2 = [=]()->oml_root* {return (([=](std::function< oml_root*(oml_root*,oml_root*) > my_add2)
    {
        my_add2=[=](oml_root* a,oml_root* b)
        {
            return ((new_number(to_number(a)+to_number(b))));
        };
        return (console_log(my_add2(new_number(33),new_number(44))));
    })(0));
                                                                  };
    dummy2();
    console_log((new_number(to_number(new_number(2))*to_number(new_number(3)))));

    return 0;
}
