#include <iostream>
#include <string>
#include <sstream>
#include <cmath>
#include <vector>
#include <functional>

#include <gc/gc.h>
#include <gc/gc_cpp.h>
#include <gc/gc_allocator.h>
#include <gc/javaxfc.h>

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
        return !(this->value == 0 || this->value == nan);
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

using oml_list_data = std::vector<oml_root *, gc_allocator<oml_root *>>;

class oml_list : public oml_root
{
    oml_list_data *value;

public:
    oml_list(oml_list_data *data = nullptr)
        //: value(new (GC) oml_list_data())
    {
        if (data == nullptr) data = new (GC) oml_list_data();
        this->value = data;
    }
    virtual const std::string string_value()
    {
        std::string result = "[ ";
        for (std::size_t i = 0; i < this->value->size(); i++)
        {
            if (i > 0)
                result += ", ";
            result += ::string_value((*this->value)[i]);
        }
        result += " ]";
        return result;
    }
    virtual bool bool_value()
    {
        return true;
    }
    virtual void push(oml_root *x)
    {
        this->value->push_back(x);
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

static inline oml_root *new_list(oml_list_data *data = nullptr)
{
    return new (GC) oml_list(data);
    /*
    oml_list *result = new (GC) oml_list();
    for (std::size_t i = 0; i < list->size(); i++)
    {
        result->push((*list)[i]);
    }
    return result;
    */
}

oml_root *print(oml_root *x)
{
    std::cout << string_value(x) << std::endl;
    return x;
}
