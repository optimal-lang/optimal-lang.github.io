#include "omlcpp.h"
#include <iostream>
#include <functional>
#include <vector>
#include <gc/gc.h>
#include <gc/gc_cpp.h>

int main()
{
    GC_INIT();
    console_log(new_number(123));
    oml_root* n=new_number(777);
    console_log(n);
    std::function<oml_root*(oml_root*,oml_root*)> add2=[=](oml_root* a,oml_root* b)->oml_root* {return ((new_number(number_value(a)+number_value(b))));};
    console_log(add2(new_number(11),new_number(22)));
    console_log((new_number(number_value(n)+12)));
    ([=](oml_root* a,oml_root* b)
    {
        a=new_number(11);
        b=new_number(22);
        return (console_log((new_number(number_value(a)+number_value(b)))));
    })(0,0);
    std::function<oml_root*(oml_root*)> fact=[=](oml_root* x)->oml_root* {return (([=](oml_root* n,oml_root* rlt)
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
    oml_root* x=new_number(-2);
    (function()
    {
        switch(x)
        {
        case -1:
            return (console_log("(case1)"),new_number(1));
        default:
            return (console_log("(case2)"),new_number(2));
        }
        return null
    })();

    return 0;
}
