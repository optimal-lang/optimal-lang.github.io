#include <iostream>
#include <string>
#include <sstream>
#include <cmath>
#include <vector>
#include <map>
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
    virtual void push(oml_root *x)
    {
        {
        }
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

class oml_bool : public oml_root
{
    bool value;

public:
    oml_bool(bool b) : value(b)
    {
    }
    virtual const std::string string_value()
    {
        static std::string false_ = "false";
        static std::string true_ = "true";
        return this->value ? true_ : false_;
    }
    virtual bool bool_value()
    {
        return this->value;
    }
};

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
        // static std::string s;
        std::ostringstream stream;
        stream << this->value;
        return stream.str();
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
        std::string s = "\"";
        // s +=  this->value;
        for (std::size_t i = 0; i < this->value.size(); i++)
        {
            char c = this->value[i];
            switch (c)
            {
            case '\n':
                s += "\\n";
                break;
            default:
                s += c;
                break;
            }
        }
        s += "\"";
        return s;
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
    {
        if (data == nullptr)
            data = new (GC) oml_list_data();
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

struct oml_dict_less
{
    bool operator()(oml_root *lhs, oml_root *rhs) const
    {
        return ::string_value(lhs) < ::string_value(rhs);
    }
};

using oml_dict_data = std::multimap<oml_root *, oml_root *, oml_dict_less, gc_allocator<std::pair<oml_root *, oml_root *>>>;

class oml_dict : public oml_root
{
    oml_dict_data *value;

public:
    oml_dict(oml_dict_data *data = nullptr)
    {
        if (data == nullptr)
            data = new (GC) oml_dict_data();
        this->value = data;
    }
    virtual const std::string string_value()
    {
        std::string result = "{ ";
        std::size_t i = 0;
        for (oml_dict_data::iterator it = this->value->begin(); it != this->value->end(); ++it)
        {
            if (i > 0)
                result += ", ";
            result += ::string_value(it->first);
            result += ": ";
            result += ::string_value(it->second);
            i++;
        }
        result += " }";
        return result;
    }
    virtual bool bool_value()
    {
        return true;
    }
};

static inline oml_root *new_bool(bool b)
{
    static oml_bool *true_ = nullptr;
    static oml_bool *false_ = nullptr;
    if (!true_)
        true_ = new (GC) oml_bool(true);
    if (!false_)
        false_ = new (GC) oml_bool(false);
    return b ? true_ : false_;
}

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
}

static inline oml_root *new_dict(oml_dict_data *data = nullptr)
{
    return new (GC) oml_dict(data);
}

oml_root *print(oml_root *x)
{
    std::cout << string_value(x) << std::endl;
    return x;
}
