#include <iostream>
#include <functional>
#include <vector>

double console_log(double x)
{
    std::cerr << x << std::endl;
    return x;
}

int main()
{
    class Dummy
    {
    public:
        int a = 0;
    };
    static std::function< double(double,double) > add2 = [=](double a,double b)->double {return ((a+b));};
    console_log(add2(11,22));
    console_log((5*(2+3)*10));
    static double x = add2(100,23);
    static std::function< double(double) > add_x = [=](double n)->double {return ((n+x));};
    console_log(add_x(10));
    console_log(([=](double x,double y)
    {
        return ((x+y));
    })(11,22));
    console_log(([=](double x,double y)
    {
        x=11;
        y=22;
        return ((x+y));
    })(0,0));
    static std::function< double(double) > fact = [=](double x)->double {return (([=](double n,double rlt)
    {
        n=2;
        rlt=1;
        return ((([&]()->void {while(!(x<n))
    {
        (rlt=(rlt*n),n=(1+n));
        }})(),0),rlt);
    })(0,0));};
    console_log(fact(4));
    static std::function< double(double) > fact2 = [=](double x)->double {return (([=](double n,double rlt)
    {
        return ((([&]()->void {while(!(x<n))
    {
        double __do__[2];
            (rlt=(rlt*n),__do__[0]=(1+n),n=__do__[0]);
        }})(),0),rlt);
    })(2,1));};
    console_log(fact2(4));
    static std::function< double() > dummy1 = [=]()->double {return (([=](double a)
    {
        return (([=](double b)
        {
            return (console_log((a+b)));
        })(33));
    })(22));};
    dummy1();

    return 0;
}
