#include <gc/gc.h>
#include <gc/gc_cpp.h>
#include <iostream>

class oml_root: public gc_cleanup
{
/*
public:
    double value;
    oml_root(double n) : value(n)
    {
    }
*/
public:
    virtual double number_value() = 0;
};

class oml_number: public oml_root
{
    double value;
public:
    oml_number(double n) : value(n)
    {
    }
    virtual double number_value()
    {
        return this->value;
    }
};

static oml_root* undefined = (oml_root*)-1;

static inline oml_root* new_number(double n)
{
    return new(GC) oml_number(n);
}

static inline double number_value(oml_root* n)
{
    if (n==nullptr) return 0;
    if (n==undefined) return 0;
    return n->number_value();
}

oml_root* console_log(oml_root* x)
{
    std::cerr << number_value(x) << std::endl;
    return x;
}
