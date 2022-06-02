#include <gc/gc.h>
#include <gc/gc_cpp.h>
#include <iostream>

class oml_root: public gc_cleanup
{
public:
    double value;
    oml_root(double n) : value(n)
    {
    }
};

/*
oml_root* operator+(oml_root* a, oml_root* b) {
    return new(GC) oml_root( a==nullptr?0:a->value + b==nullptr?0:b->value );
}
*/

static inline oml_root* new_number(double n)
{
    return new(GC) oml_root(n);
}

static inline double number_value(oml_root* n)
{
    return n==nullptr ? 0 : n->value;
}

oml_root* console_log(oml_root* x)
{
    std::cerr << number_value(x) << std::endl;
    return x;
}
