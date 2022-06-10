#include <gc/gc.h>
#include <gc/gc_cpp.h>
#include <iostream>
#include <string>
#include <sstream>
#include <cmath>

class oml_root : public gc_cleanup
{
public:
    virtual double number_value()
    {
        return 0;
    }
    virtual const std::string string_value()
    {
        static std::string empty = "";
        return empty;
    }
    virtual bool bool_value()
    {
        return false;
    }
};

static oml_root *null = (oml_root *)nullptr;
static oml_root *undefined = (oml_root *)-1;

class oml_number : public oml_root
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
    virtual const std::string string_value()
    {
        static std::string s;
        std::ostringstream stream;
        stream << this->value;
        s = stream.str();
        return s;
    }
    virtual bool bool_value()
    {
        static double nan = std::nan("");
        return !(this->value==0 || this->value==nan);
    }
};

class oml_string : public oml_root
{
    std::string value;

public:
    oml_string(const std::string &s) : value(s)
    {
    }
    virtual const std::string string_value()
    {
        return this->value;
    }
    virtual bool bool_value()
    {
        return !this->value.empty();
    }
};

static inline oml_root *new_number(double n)
{
    return new (GC) oml_number(n);
}

static inline oml_root *new_string(const std::string &s)
{
    return new (GC) oml_string(s);
}

static inline double number_value(oml_root *x)
{
    if (x == nullptr)
        return 0;
    if (x == undefined)
        return 0;
    return x->number_value();
}

static inline const std::string string_value(oml_root *x)
{
    static std::string null_ = "null";
    static std::string undefined_ = "undefined";
    if (x == nullptr)
        return null_;
    if (x == undefined)
        return undefined_;
    return x->string_value();
}

static inline bool bool_value(bool x)
{
    return x;
}

static inline bool bool_value(oml_root *x)
{
    if (x == nullptr)
        return false;
    if (x == undefined)
        return false;
    return x->bool_value();
}

oml_root *console_log(oml_root *x)
{
    std::cout << string_value(x) << std::endl;
    return null;
}

oml_root *print(oml_root *x)
{
    std::cout << string_value(x) << std::endl;
    return x;
}
