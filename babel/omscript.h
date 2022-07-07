#ifndef OMSCRIPT_H
#define OMSCRIPT_H

#include <stdint.h>
#include <iostream>
#include <memory>
#include <string>
#include <sstream>
#include <cmath>
#include <vector>
#include <map>
#include <functional>
#include <algorithm>
#include <exception>

#define DEFPTR(CLS) std::shared_ptr<CLS>
#define NEWPTR(CLS, ARGS) std::shared_ptr<CLS>(new CLS ARGS)
#define GETPTR(P) (P.get())
#define GC_INIT()
using om_data = std::shared_ptr<class om_register>;
using om_list_data = std::vector<om_data>;
using om_dict_data = std::map<std::string, om_data>;
using om_func_def = std::function<om_data(om_list_data)>;

class om_callback
{
public:
    virtual ~om_callback() {}
    virtual om_data run(om_list_data)
    {
        throw std::runtime_error("run is not overridden");
    }
};

#if !defined(SWIG)
namespace om
{
    bool eq(om_data a, om_data b);
    bool equal(om_data a, om_data b);
}
#endif

class om_register
{
public:
    enum type
    {
        UNDEFINED,
        NULL_,
        BOOL,
        NUMBER,
        STRING,
        LIST,
        DICTIONARY,
        FUNCTION
    };
    virtual type type_of();
    virtual std::string printable_text();
    virtual bool bool_value();
    virtual double number_value();
    virtual const std::string string_value();
    virtual void push(om_data x);
    //virtual om_data operator+(om_register &other);
    //virtual om_data operator()(om_list_data __arguments__);
    virtual om_data &operator[](om_data index);
};

/*
namespace om
{
    bool eq(om_data a, om_data b);
    bool equal(om_data a, om_data b);
}
*/

class om_undefined : public om_register
{
public:
    om_undefined();
    virtual type type_of();
    virtual std::string printable_text();
    virtual const std::string string_value();
};

class om_null : public om_register
{
public:
    om_null();
    virtual type type_of();
    virtual std::string printable_text();
    virtual const std::string string_value();
};

bool bool_value(bool x);
bool bool_value(om_data x);
bool bool_value(om_register *x);
double number_value(om_data x);
double number_value(om_register *x);
const std::string string_value(om_data x);
const std::string string_value(om_register *x);
const std::string printable_text(om_data x);

std::string stringify_sting(const std::string &s);

class om_bool : public om_register
{
    bool value;

public:
    om_bool(bool b);
    virtual type type_of();
    virtual std::string printable_text();
    virtual const std::string string_value();
    virtual bool bool_value();
    virtual double number_value();
};

class om_number : public om_register
{
    double value;

public:
    om_number(double n);
    virtual type type_of();
    virtual std::string printable_text();
    virtual double number_value();
    virtual const std::string string_value();
    virtual bool bool_value();
};

class om_string : public om_register
{
    std::string value;

public:
    om_string(const std::string &s);
    virtual type type_of();
    virtual std::string printable_text();
    virtual const std::string string_value();
    virtual bool bool_value();
};

class om_list : public om_register
{
    // DEFPTR(om_list_data) value;
    om_list_data value;
    // DEFPTR(om_dict_data) props;
    om_dict_data props;

public:
    om_list(om_list_data data = {}, om_dict_data props = {});
    virtual type type_of();
    virtual std::string printable_text();
    virtual const std::string string_value();
    virtual bool bool_value();
    virtual void push(om_data x);
    friend bool om::equal(om_data a, om_data b);
    virtual om_data &operator[](om_data index);
};

class om_dict : public om_register
{
    // DEFPTR(om_dict_data) value;
    om_dict_data props;

public:
    om_dict(om_dict_data data = {});
    virtual type type_of();
    virtual std::string printable_text();
    virtual const std::string string_value();
    virtual bool bool_value();
    friend bool om::equal(om_data a, om_data b);
};

class om_func : public om_register
{
    om_callback *callback = nullptr;
    om_func_def value = nullptr;

public:
    om_func(om_callback *data);
#if !defined(SWIG)
    om_func(om_func_def data);
#endif
    virtual type type_of();
    virtual std::string printable_text();
    virtual const std::string string_value();
    virtual bool bool_value();
    virtual om_data operator()(om_data __this__, om_list_data __arguments__);
};

om_data new_undefined();

om_data new_null();

om_data new_bool(bool b);

om_data new_number(double n);

om_data new_string(const std::string &s);

om_data new_list(om_list_data array = {}, om_dict_data props = {});

om_data new_dict(om_dict_data data);
// om_data new_dict_pairs(std::vector<std::pair<std::string, om_data>> args);

om_data new_func(om_callback *callback);

#if !defined(SWIG)
om_data new_func(om_func_def def);
#endif

om_data __get_arg__(om_list_data &args, long long index);

om_data __print__(om_data x);

om_data __eq__(om_data a, om_data b);
om_data __equal__(om_data a, om_data b);

om_data __call__(om_data f, om_data __this__, om_list_data __arguments__);

om_data __op_add__(om_data a, om_data b);

#endif //OMSCRIPT_H
