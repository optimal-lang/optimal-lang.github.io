#ifndef OMVAR_H
#define OMVAR_H

#include "omscript.h"

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
    operator bool()
    {
        return ::bool_value(this->data);
    }
    var operator+(var &other)
    {
        om_data sum = ::new_number(::number_value(this->data) + ::number_value(other.data));
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
        var result = (*(this->data.get()))(args);
        return result;
    }
};

var var_print(const var &x)
{
    ::print(x.data);
    return x;
}

var var_concat(std::vector<var> args)
{
    std::string result;
    for (long long i=0; i<args.size(); i++)
    {
        result += ::string_value(args[i].data);
    }
    return ::new_string(result);
}

#endif // OMVAR_H