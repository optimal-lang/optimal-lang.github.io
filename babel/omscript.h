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
#define NEWPTR(CLS,ARGS) std::shared_ptr<CLS>(new CLS ARGS)
#define GETPTR(P) (P.get())
#define GC_INIT()
using om_register_ptr = std::shared_ptr<class om_register>;
using om_list_data = std::vector<om_register_ptr>;
using om_dict_data = std::map<std::string, om_register_ptr>;

#if !defined(SWIG)
namespace om
{
    bool eq(om_register_ptr a, om_register_ptr b);
    bool equal(om_register_ptr a, om_register_ptr b);
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
    virtual void push(om_register_ptr x);
    virtual om_register_ptr operator+(om_register &other);
    virtual om_register_ptr operator()(om_list_data __arguments__);
    virtual om_register_ptr &operator[](om_register_ptr index);
};

/*
namespace om
{
    bool eq(om_register_ptr a, om_register_ptr b);
    bool equal(om_register_ptr a, om_register_ptr b);
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
bool bool_value(om_register_ptr x);
bool bool_value(om_register *x);
double number_value(om_register_ptr x);
double number_value(om_register *x);
const std::string string_value(om_register_ptr x);
const std::string string_value(om_register *x);
const std::string printable_text(om_register_ptr x);

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
    //DEFPTR(om_list_data) value;
    om_list_data value;
    //DEFPTR(om_dict_data) props;
    om_dict_data props;

public:
    om_list(om_list_data data = {}, om_dict_data props = {});
    virtual type type_of();
    virtual std::string printable_text();
    virtual const std::string string_value();
    virtual bool bool_value();
    virtual void push(om_register_ptr x);
    friend bool om::equal(om_register_ptr a, om_register_ptr b);
    virtual om_register_ptr &operator[](om_register_ptr index);
};

class om_dict : public om_register
{
    //DEFPTR(om_dict_data) value;
    om_dict_data props;

public:
    om_dict(om_dict_data data = {});
    virtual type type_of();
    virtual std::string printable_text();
    virtual const std::string string_value();
    virtual bool bool_value();
    friend bool om::equal(om_register_ptr a, om_register_ptr b);
};

using om_func_def = std::function<om_register_ptr (om_list_data)>;

class om_func : public om_register
{
    om_func_def value;

public:
    om_func(om_func_def data);
    virtual type type_of();
    virtual std::string printable_text();
    virtual const std::string string_value();
    virtual bool bool_value();
    virtual om_register_ptr operator()(om_list_data __arguments__);
};

om_register_ptr new_undefined();

om_register_ptr new_null();

om_register_ptr new_bool(bool b);

om_register_ptr new_number(double n);

om_register_ptr new_string(const std::string &s);

om_register_ptr new_list(std::vector<om_register_ptr> args);

om_register_ptr new_dict(std::vector<std::pair<std::string, om_register_ptr>> args);

om_register_ptr new_func(om_func_def def);

om_register_ptr get_arg(om_list_data &args, std::size_t index);

/*
om_register_ptr console_log(om_register_ptr x)
{
    std::cout << string_value(x) << std::endl;
    return new_null();
}
*/

om_register_ptr print(om_register_ptr x);

om_register_ptr eq(om_register_ptr a, om_register_ptr b);
om_register_ptr equal(om_register_ptr a, om_register_ptr b);
