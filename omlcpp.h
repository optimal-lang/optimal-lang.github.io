#include <gc/gc.h>
#include <gc/gc_cpp.h>
#include <iostream>
#include <string>
#include <sstream>

class oml_root : public gc_cleanup
{
public:
    virtual double number_value()
    {
        return 0;
    }
    virtual const std::string &string_value()
    {
        static std::string empty = "";
        return empty;
    }
};

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
    virtual const std::string &string_value()
    {
        static std::string s;
        std::ostringstream stream;
        stream << this->value;
        s = stream.str();
        return s;
    }
};

class oml_string : public oml_root
{
    std::string value;

public:
    oml_string(const std::string &s) : value(s)
    {
    }
    virtual const std::string &string_value()
    {
        return this->value;
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

static inline const std::string &string_value(oml_root *x)
{
    static std::string null_ = "null";
    static std::string undefined_ = "undefined";
    if (x == nullptr)
        return null_;
    if (x == undefined)
        return undefined_;
    return x->string_value();
}

oml_root *console_log(oml_root *x)
{
    std::cerr << string_value(x) << std::endl;
    return x;
}
