#include "omvar.h"

int main()
{
    //GC_INIT();
    static om_data null = new_null();
    static om_data undefined = new_undefined();
    try
    {
        var add2=(var_func)([&](std::vector<var> __arguments__)->var{var a=get_arg(__arguments__, 0); var b=get_arg(__arguments__, 1); {{return (a+b);} return undefined;}});
        print({add2({new_number(11),new_number(22)})});

    }
    catch(std::runtime_error e)
    {
        std::cerr << "std::runtime_error: " << e.what() << std::endl;
    }
    return 0;
}
