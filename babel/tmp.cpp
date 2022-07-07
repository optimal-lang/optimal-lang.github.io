#include "omvar.h"

int main()
{
    //GC_INIT();
    static om_data null = new_null();
    static om_data undefined = new_undefined();
    try
    {
        var add2=(var_func)([&](std::vector<var> __arguments__)->var{var a=get_arg(__arguments__, 0); var b=get_arg(__arguments__, 1); {{return (a+b);} return undefined;}});
        print({add2({var(11),var(22)})});
        var x=var(123);
        print({x});
        var add3=(var_func)([&](std::vector<var> __arguments__)->var{var a=get_arg(__arguments__, 0); var b=get_arg(__arguments__, 1); var c=get_arg(__arguments__, 2); {{return ((a+b)+c);} return undefined;}});
        print({add3({var(11),var(22),var(33)})});
        var test01=(var_func)([&](std::vector<var> __arguments__)->var{var a=get_arg(__arguments__, 0); {{var a10=(a+var(10)); print({a10});} return undefined;}});
        print({test01({var(22)})});
        var y=((var(1)+var(2))+var(3));
        print({y});
        print({var("abc")});
        print({(var("abc")+var(123))});
        print({(var("abc")+null)});
        print({(var("abc")+undefined)});

    }
    catch(std::runtime_error e)
    {
        std::cerr << "std::runtime_error: " << e.what() << std::endl;
    }
    return 0;
}
