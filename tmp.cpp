#include <iostream>
#include <functional>

void console_log(double x)
{
    std::cerr << x << std::endl;
}

int main()
{
    static std::function< double(double,double) > add2 = [=](double a,double b)->double {return ((a+b));};
    console_log(add2(11,22));
    console_log((5*(2+3)*10));
    static double x = add2(100,23);
    static std::function< double(double) > add_x = [=](double n)->double {return ((n+x));};
    console_log(add_x(10));

    return 0;
}
