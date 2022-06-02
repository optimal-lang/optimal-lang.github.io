#include <iostream>
#include <vector>

class test {
public:
    enum funcs {
        A,
        B,
        C
    };
    double call(funcs f, std::vector<double> &args)
    {
        return 0;
    }
};

class test2 {
public:
    enum funcs {
        A,
        B,
        C
    };
};

int main()
{
    test *t = new test();
    std::cerr << t->A << std::endl;
    return 0;
}