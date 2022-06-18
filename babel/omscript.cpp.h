#include <iostream>
#include <string>
#include <sstream>
#include <cmath>
#include <vector>
#include <map>
#include <functional>
#include <algorithm>

#include <gc/gc.h>
#include <gc/gc_cpp.h>
#include <gc/gc_allocator.h>
#include <gc/javaxfc.h>

using om_list_data = std::vector<class om_register *, gc_allocator<class om_register *>>;
using om_dict_key = std::basic_string<char, std::char_traits<char>, gc_allocator<char>>;
using om_dict_data = std::map<om_dict_key, class om_register *, std::less<om_dict_key>, gc_allocator<std::pair<om_dict_key, class om_register *>>>;

class om_register : public gc_cleanup
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
    virtual type type_of()
    {
        return (type)-1;
    }
    virtual std::string printable_text()
    {
        return "?";
    }
    virtual bool bool_value()
    {
        return false;
    }
    virtual double number_value()
    {
        return 0;
    }
    virtual const std::string string_value()
    {
        static std::string empty = "";
        return empty;
    }
    virtual void push(om_register *x)
    {
    }
    om_register *operator+(om_register &other);
    virtual om_register *operator()(om_list_data __arguments__);
};

namespace om
{
    bool eq(om_register *a, om_register *b);
    bool equal(om_register *a, om_register *b);
}

class om_undefined : public om_register
{
public:
    om_undefined()
    {
    }
    virtual type type_of()
    {
        return UNDEFINED;
    }
    virtual std::string printable_text()
    {
        return "undefined";
    }
    virtual const std::string string_value()
    {
        return "undefined";
    }
};

class om_null : public om_register
{
public:
    om_null()
    {
    }
    virtual type type_of()
    {
        return NULL_;
    }
    virtual std::string printable_text()
    {
        return "null";
    }
    virtual const std::string string_value()
    {
        return "null";
    }
};

// static om_register *null = (om_register *)nullptr;
// static om_register *undefined = (om_register *)-1;

static inline bool bool_value(bool x)
{
    return x;
}

static inline bool bool_value(om_register *x)
{
    return x->bool_value();
}

static inline double number_value(om_register *x)
{
    return x->number_value();
}

static inline const std::string string_value(om_register *x)
{
    return x->string_value();
}

static inline const std::string printable_text(om_register *x)
{
    return x->printable_text();
}

static inline std::string stringify_sting(const std::string &s)
{
    std::string result = "\"";
    for (std::size_t i = 0; i < s.size(); i++)
    {
        char c = s[i];
        switch (c)
        {
        case '\n':
            result += "\\n";
            break;
        default:
            result += c;
            break;
        }
    }
    result += "\"";
    return result;
}

class om_bool : public om_register
{
    bool value;

public:
    om_bool(bool b) : value(b)
    {
    }
    virtual type type_of()
    {
        return BOOL;
    }
    virtual std::string printable_text()
    {
        return this->string_value();
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
    virtual double number_value()
    {
        return this->value ? 1 : 0;
    }
};

class om_number : public om_register
{
    double value;

public:
    om_number(double n) : value(n)
    {
    }
    virtual type type_of()
    {
        return NUMBER;
    }
    virtual std::string printable_text()
    {
        return this->string_value();
    }
    virtual double number_value()
    {
        return this->value;
    }
    virtual const std::string string_value()
    {
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

class om_string : public om_register
{
    std::string value;

public:
    om_string(const std::string &s) : value(s)
    {
    }
    virtual type type_of()
    {
        return STRING;
    }
    virtual std::string printable_text()
    {
        return stringify_sting(this->value);
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

class om_list : public om_register
{
    om_list_data *value;
    om_dict_data *props;

public:
    om_list(om_list_data *data = nullptr, om_dict_data *props = nullptr)
    {
        if (data == nullptr)
            data = new (GC) om_list_data();
        this->value = data;
        if (props == nullptr)
            props = new (GC) om_dict_data();
        this->props = props;
    }
    virtual type type_of()
    {
        return LIST;
    }
    virtual std::string printable_text()
    {
        std::string result = "( ";
        for (std::size_t i = 0; i < this->value->size(); i++)
        {
            if (i > 0)
                result += " ";
            result += ::printable_text((*this->value)[i]);
        }
        std::vector<om_dict_key, gc_allocator<om_dict_key>> keys;
        for (om_dict_data::iterator it = this->props->begin(); it != this->props->end(); ++it)
        {
            keys.push_back(it->first);
        }
        std::sort(keys.begin(), keys.end());
        if (keys.size() > 0)
        {
            if (this->value->size() > 0)
                result += " ";
            result += "?";
            for (std::size_t i = 0; i < keys.size(); i++)
            {
                om_dict_key key = keys[i];
                result += " (";
                result += stringify_sting(std::string(key.begin(), key.end()));
                result += " ";
                result += ::printable_text(this->props->at(key));
                result += ")";
            }
        }
        result += " )";
        return result;
    }
    virtual const std::string string_value()
    {
        std::string result = "";
        for (std::size_t i = 0; i < this->value->size(); i++)
        {
            if (i > 0)
                result += ",";
            result += ::string_value((*this->value)[i]);
        }
        return result;
    }
    virtual bool bool_value()
    {
        return true;
    }
    virtual void push(om_register *x)
    {
        this->value->push_back(x);
    }
    friend bool om::equal(om_register *a, om_register *b);
};

class om_dict : public om_register
{
    om_dict_data *value;

public:
    om_dict(om_dict_data *data = nullptr)
    {
        if (data == nullptr)
            data = new (GC) om_dict_data();
        this->value = data;
    }
    virtual type type_of()
    {
        return DICTIONARY;
    }
    virtual std::string printable_text()
    {
        std::string result = "{ ";
        std::vector<om_dict_key, gc_allocator<om_dict_key>> keys;
        for (om_dict_data::iterator it = this->value->begin(); it != this->value->end(); ++it)
        {
            keys.push_back(it->first);
        }
        std::sort(keys.begin(), keys.end());
        for (std::size_t i = 0; i < keys.size(); i++)
        {
            om_dict_key key = keys[i];
            if (i > 0)
                result += " ";
            result += stringify_sting(std::string(key.begin(), key.end()));
            result += " ";
            result += ::printable_text(this->value->at(key));
        }
        result += " }";
        return result;
    }
    virtual const std::string string_value()
    {
        return "[object Object]";
    }
    virtual bool bool_value()
    {
        return true;
    }
    friend bool om::equal(om_register *a, om_register *b);
};

using om_func_def = std::function<om_register *(om_list_data)>;

class om_func : public om_register
{
    om_func_def value;

public:
    om_func(om_func_def data) : value(data)
    {
    }
    virtual type type_of()
    {
        return FUNCTION;
    }
    virtual std::string printable_text()
    {
        return "function";
    }
    virtual const std::string string_value()
    {
        return "function ?";
    }
    virtual bool bool_value()
    {
        return true;
    }
    virtual om_register *operator()(om_list_data __arguments__)
    {
        return this->value(__arguments__);
    }
    // friend bool om::equal(om_register *a, om_register *b);
};

static inline om_register *new_undefined()
{
    static om_undefined *undefined = nullptr;
    if (!undefined)
        undefined = new (GC) om_undefined();
    return undefined;
}

static inline om_register *new_null()
{
    static om_null *null = nullptr;
    if (!null)
        null = new (GC) om_null();
    return null;
}

static inline om_register *new_bool(bool b)
{
    static om_bool *true_ = nullptr;
    static om_bool *false_ = nullptr;
    if (!true_)
        true_ = new (GC) om_bool(true);
    if (!false_)
        false_ = new (GC) om_bool(false);
    return b ? true_ : false_;
}

static inline om_register *new_number(double n)
{
    return new (GC) om_number(n);
}

static inline om_register *new_string(const std::string &s)
{
    return new (GC) om_string(s);
}

om_register *new_list(std::initializer_list<om_register *> args)
{
    om_list_data *data = new (GC) om_list_data();
    for (om_register *i : args)
    {
        data->push_back(i);
    }
    return new (GC) om_list(data);
}

om_register *new_dict(std::initializer_list<std::pair<om_dict_key, om_register *>> args)
{
    om_dict_data *data = new (GC) om_dict_data();
    for (std::pair<om_dict_key, om_register *> i : args)
    {
        data->insert(i);
    }
    return new (GC) om_dict(data);
}

om_register *new_func(om_func_def def)
{
    return new (GC) om_func(def);
}

static inline om_register *get_arg(om_list_data &args, std::size_t index)
{
    if (index >= args.size())
        return new_undefined();
    return args[index];
}

om_register *om_register::operator+(om_register &other)
{
    if ((this->type_of() == om_register::type::NULL_ || this->type_of() == om_register::type::UNDEFINED) &&
        (other.type_of() == om_register::type::NULL_ || other.type_of() == om_register::type::UNDEFINED))
    {
        return new_null();
    }
    if (this->type_of() == om_register::type::STRING || other.type_of() == om_register::type::STRING)
    {
        return new_string(::string_value(this) + ::string_value(&other));
    }
    if (this->type_of() == om_register::type::LIST)
    {
        return new_string(::string_value(this) + ::string_value(&other));
    }
    return new_number(::number_value(this) + ::number_value(&other));
}

om_register *om_register::operator()(om_list_data __arguments__)
{
    return new_undefined();
}

om_register *console_log(om_register *x)
{
    std::cout << string_value(x) << std::endl;
    return new_null();
}

om_register *print(om_register *x)
{
    std::cout << printable_text(x) << std::endl;
    return x;
}

namespace om
{
    bool eq(om_register *a, om_register *b)
    {
        if (a == b)
            return true;
        if (a == new_null() || a == new_undefined() || b == new_null() || b == new_undefined())
            return (false);
        if (a->type_of() != b->type_of())
            return (false);
        switch (a->type_of())
        {
        case om_register::type::BOOL:
            return (bool_value(a) == bool_value(b));
            break;
        case om_register::type::NUMBER:
            return (number_value(a) == number_value(b));
            break;
        case om_register::type::STRING:
            return (string_value(a) == string_value(b));
            break;
        case om_register::type::LIST:
            return (false);
            break;
            break;
        case om_register::type::DICTIONARY:
            return (false);
            break;
        }
        return (false);
    }
    bool equal(om_register *a, om_register *b)
    {
        if (a == new_null())
            return (b == new_null());
        if (a == new_undefined())
            return (b == new_undefined());
        if (a == new_null() || a == new_undefined() || b == new_null() || b == new_undefined())
            return (false);
        if (a->type_of() != b->type_of())
            return (false);
        switch (a->type_of())
        {
        case om_register::type::BOOL:
            return (bool_value(a) == bool_value(b));
            break;
        case om_register::type::NUMBER:
            return (number_value(a) == number_value(b));
            break;
        case om_register::type::STRING:
            return (string_value(a) == string_value(b));
            break;
        case om_register::type::LIST:
        {
            om_list_data *la = ((om_list *)a)->value;
            om_list_data *lb = ((om_list *)b)->value;
            if (la->size() != lb->size())
                return (false);
            for (std::size_t i = 0; i < la->size(); i++)
            {
                if (!bool_value(equal((*la)[i], (*lb)[i])))
                    return (false);
            }
            om_dict_data *da = ((om_list *)a)->props;
            om_dict_data *db = ((om_list *)b)->props;
            std::vector<om_dict_key, gc_allocator<om_dict_key>> a_keys;
            for (om_dict_data::iterator it = da->begin(); it != da->end(); ++it)
            {
                a_keys.push_back(it->first);
            }
            std::sort(a_keys.begin(), a_keys.end());
            std::vector<om_dict_key, gc_allocator<om_dict_key>> b_keys;
            for (om_dict_data::iterator it = db->begin(); it != db->end(); ++it)
            {
                b_keys.push_back(it->first);
            }
            std::sort(b_keys.begin(), b_keys.end());
            if (a_keys != b_keys)
                return (false);
            for (std::size_t i = 0; i < a_keys.size(); i++)
            {
                om_dict_key key = a_keys[i];
                if (!bool_value(equal(da->at(key), db->at(key))))
                    return (false);
            }
            return (true);
        }
        break;
        case om_register::type::DICTIONARY:
        {
            om_dict_data *da = ((om_dict *)a)->value;
            om_dict_data *db = ((om_dict *)b)->value;
            std::vector<om_dict_key, gc_allocator<om_dict_key>> a_keys;
            for (om_dict_data::iterator it = da->begin(); it != da->end(); ++it)
            {
                a_keys.push_back(it->first);
            }
            std::sort(a_keys.begin(), a_keys.end());
            std::vector<om_dict_key, gc_allocator<om_dict_key>> b_keys;
            for (om_dict_data::iterator it = db->begin(); it != db->end(); ++it)
            {
                b_keys.push_back(it->first);
            }
            std::sort(b_keys.begin(), b_keys.end());
            if (a_keys != b_keys)
                return (false);
            for (std::size_t i = 0; i < a_keys.size(); i++)
            {
                om_dict_key key = a_keys[i];
                if (!bool_value(equal(da->at(key), db->at(key))))
                    return (false);
            }
            return (true);
        }
        break;
        }
        return (false);
    }
}

om_register *eq(om_register *a, om_register *b)
{
    return new_bool(om::eq(a, b));
}
om_register *equal(om_register *a, om_register *b)
{
    return new_bool(om::equal(a, b));
}
