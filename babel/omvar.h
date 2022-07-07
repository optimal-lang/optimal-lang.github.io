#ifndef OMVAR_H
#define OMVAR_H

#include "omscript.h"

class var;

using var_func = std::function<var(std::vector<var>)>;

class var
{
//protected:
public:
    om_data data;
    var()
    {
        this->data = ::new_undefined();
    }
    var(om_data data)
    {
        this->data = data;
    }
    var(double x)
    {
        this->data = ::new_number(x);
    }
    var(const std::string &x)
    {
        this->data = ::new_string(x);
    }
    var(const char *x)
    {
        this->data = ::new_string(x);
    }
    var(om_func_def x)
    {
        this->data = ::new_func(x);
    }
    var(var_func x)
    {
        this->data = ::new_func([x](om_list_data __arguments__)->om_data{
            std::vector<var> args;
            for (long long i=0; i<__arguments__.size(); i++)
            {
                args.push_back(var(__arguments__[i]));
            }
            return (x(args)).data;
        });
    }
    /*
    bool to_bool()
    {
        return ::bool_value(this->data);
    }
    */
    operator bool()
    {
        return ::bool_value(this->data);
    }
    var operator+(const var &other)
    {
        //__print__(this->data);
        //__print__(other.data);
        //om_data sum = ::new_number(::number_value(this->data) + ::number_value(other.data));
        om_data sum = ::__op_add__(this->data, other.data);
        var result = sum;
        return result;
    }
    var operator()(std::vector<var> __arguments__)
    {
        om_list_data args;
        for(long long i=0; i<__arguments__.size(); i++)
        {
            args.push_back(__arguments__[i].data);
        }
        //var result = (*(this->data.get()))(args);
        var result = __call__(this->data, new_undefined(), args);
        return result;
    }
};

var print(const var &x)
{
    ::__print__(x.data);
    return x;
}

var eq(const var &a, const var &b)
{
    return ::__eq__(a.data, b.data);
}

var equal(const var &a, const var &b)
{
    return ::__equal__(a.data, b.data);
}

var concat(std::vector<var> args)
{
    std::string result;
    for (long long i=0; i<args.size(); i++)
    {
        result += ::string_value(args[i].data);
    }
    return ::new_string(result);
}

var get_arg(std::vector<var> args, long long index)
{
    if (index >= args.size())
        return new_undefined();
    return args[index];
}

#endif // OMVAR_H
