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

#if defined(OM_USE_GC)
#include <gc/gc.h>
#include <gc/gc_cpp.h>
#include <gc/gc_allocator.h>
#include <gc/javaxfc.h>
#endif

#if defined(OM_USE_GC)
#define DEFPTR(CLS) CLS*
#define NEWPTR(CLS,ARGS) (new (GC) CLS ARGS)
#define GETPTR(P) (P)
using om_register_ptr = class om_register *;
using om_list_data = std::vector<om_register_ptr, gc_allocator<om_register_ptr>>;
using om_dict_key = std::basic_string<char, std::char_traits<char>, gc_allocator<char>>;
using om_dict_data = std::map<om_dict_key, om_register_ptr, std::less<om_dict_key>, gc_allocator<std::pair<om_dict_key, om_register_ptr>>>;
#else
#define DEFPTR(CLS) std::shared_ptr<CLS>
#define NEWPTR(CLS,ARGS) std::shared_ptr<CLS>(new CLS ARGS)
#define GETPTR(P) (P.get())
#define GC_INIT()
using om_register_ptr = std::shared_ptr<class om_register>;
using om_list_data = std::vector<om_register_ptr>;
using om_dict_key = std::string;
using om_dict_data = std::map<om_dict_key, om_register_ptr>;
#endif

class om_register
        #if defined(OM_USE_GC)
        : public gc_cleanup
        #endif
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
    virtual void push(om_register_ptr x)
    {
    }
    virtual om_register_ptr operator+(om_register &other);
    virtual om_register_ptr operator()(om_list_data __arguments__);
    //virtual om_register_ptr operator[](om_register_ptr index) const;
    virtual om_register_ptr &operator[](om_register_ptr index);
};

namespace om
{
    bool eq(om_register_ptr a, om_register_ptr b);
    bool equal(om_register_ptr a, om_register_ptr b);
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

// static om_register_ptr null = (om_register_ptr )nullptr;
// static om_register_ptr undefined = (om_register_ptr )-1;

static inline bool bool_value(bool x)
{
    return x;
}

static inline bool bool_value(om_register_ptr x)
{
    return x->bool_value();
}

#if !defined(OM_USE_GC)
static inline bool bool_value(om_register *x)
{
    return x->bool_value();
}
#endif

static inline double number_value(om_register_ptr x)
{
    return x->number_value();
}

#if !defined(OM_USE_GC)
static inline double number_value(om_register *x)
{
    return x->number_value();
}
#endif

static inline const std::string string_value(om_register_ptr x)
{
    return x->string_value();
}

#if !defined(OM_USE_GC)
static inline const std::string string_value(om_register *x)
{
    return x->string_value();
}
#endif

static inline const std::string printable_text(om_register_ptr x)
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
    DEFPTR(om_list_data) value;
    DEFPTR(om_dict_data) props;

public:
    om_list(DEFPTR(om_list_data) data = nullptr, DEFPTR(om_dict_data) props = nullptr)
    {
        if (data == nullptr)
            data = NEWPTR(om_list_data, ());
        this->value = data;
        if (props == nullptr)
            props = NEWPTR(om_dict_data, ());
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
        std::vector<om_dict_key
        #if defined(OM_USE_GC)
                , gc_allocator<om_dict_key>
        #endif
                > keys;
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
    virtual void push(om_register_ptr x)
    {
        this->value->push_back(x);
    }
    friend bool om::equal(om_register_ptr a, om_register_ptr b);
    //virtual om_register_ptr operator[](om_register_ptr index) const;
    virtual om_register_ptr &operator[](om_register_ptr index);
};

class om_dict : public om_register
{
    DEFPTR(om_dict_data) value;

public:
    om_dict(DEFPTR(om_dict_data) data = nullptr)
    {
        if (data == nullptr)
            data = NEWPTR(om_dict_data, ());
        this->value = data;
    }
    virtual type type_of()
    {
        return DICTIONARY;
    }
    virtual std::string printable_text()
    {
        std::string result = "{ ";
        std::vector<om_dict_key
        #if defined(OM_USE_GC)
                , gc_allocator<om_dict_key>
        #endif
                > keys;
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
    friend bool om::equal(om_register_ptr a, om_register_ptr b);
};

using om_func_def = std::function<om_register_ptr (om_list_data)>;

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
    virtual om_register_ptr operator()(om_list_data __arguments__)
    {
        return this->value(__arguments__);
    }
    // friend bool om::equal(om_register_ptr a, om_register_ptr b);
};

static inline om_register_ptr new_undefined()
{
    static DEFPTR(om_register) undefined = nullptr;
    if (!undefined)
        undefined = NEWPTR(om_undefined, ());
    return undefined;
}

static inline om_register_ptr new_null()
{
    static DEFPTR(om_register) null = nullptr;
    if (!null)
        null = NEWPTR(om_null, ());
    return null;
}

static inline om_register_ptr new_bool(bool b)
{
    static DEFPTR(om_register) true_ = nullptr;
    static DEFPTR(om_register) false_ = nullptr;
    if (!true_)
        true_ = NEWPTR(om_bool, (true));
    if (!false_)
        false_ = NEWPTR(om_bool, (false));
    return b ? true_ : false_;
}

static inline om_register_ptr new_number(double n)
{
    return NEWPTR(om_number, (n));
}

static inline om_register_ptr new_string(const std::string &s)
{
    return NEWPTR(om_string, (s));
}

om_register_ptr new_list(std::initializer_list<om_register_ptr > args)
{
    DEFPTR(om_list_data) data = NEWPTR(om_list_data, ());
    for (om_register_ptr i : args)
    {
        data->push_back(i);
    }
    return NEWPTR(om_list, (data));
}

om_register_ptr new_dict(std::initializer_list<std::pair<om_dict_key, om_register_ptr >> args)
{
    DEFPTR(om_dict_data) data = NEWPTR(om_dict_data, ());
    for (std::pair<om_dict_key, om_register_ptr > i : args)
    {
        data->insert(i);
    }
    return NEWPTR(om_dict, (data));
}

om_register_ptr new_func(om_func_def def)
{
    return NEWPTR(om_func, (def));
}

static inline om_register_ptr get_arg(om_list_data &args, std::size_t index)
{
    if (index >= args.size())
        return new_undefined();
    return args[index];
}

om_register_ptr om_register::operator+(om_register &other)
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

om_register_ptr om_register::operator()(om_list_data __arguments__)
{
    return new_undefined();
}

/*
om_register_ptr om_register::operator[](om_register_ptr index) const
{
    return new_undefined();
}
*/

om_register_ptr &om_register::operator[](om_register_ptr index)
{
    //static om_register_ptr dummy = new_undefined();
    static om_register_ptr dummy = new_number(123);
    return dummy;
}

/*
om_register_ptr om_list::operator[](om_register_ptr index) const
{
    if (index->type_of() != om_register::type::NUMBER)
    {
        std::string key = ::string_value(index);
        throw std::runtime_error("string index not supported");
    }
    double n = ::number_value(index);
    std::size_t i = (std::size_t)n;
    if (i != n)
        throw std::runtime_error("float index not supported");
    if (i < 0 || i >= this->value->size())
        return new_undefined();
    return (*this->value)[i];
}
*/

om_register_ptr &om_list::operator[](om_register_ptr index)
{
    if (index->type_of() != om_register::type::NUMBER)
    {
        std::string key = ::string_value(index);
        throw std::runtime_error("string index not supported");
    }
    double n = ::number_value(index);
    std::size_t i = (std::size_t)n;
    if (i != n)
        throw std::runtime_error("float index not supported");
    if (i < 0 || i >= this->value->size())
        throw std::runtime_error("index out of range(1)");
    return (*this->value)[i];
}

om_register_ptr console_log(om_register_ptr x)
{
    std::cout << string_value(x) << std::endl;
    return new_null();
}

om_register_ptr print(om_register_ptr x)
{
    std::cout << printable_text(x) << std::endl;
    return x;
}

namespace om
{
    bool eq(om_register_ptr a, om_register_ptr b)
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
    bool equal(om_register_ptr a, om_register_ptr b)
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
            DEFPTR(om_list_data) la = ((om_list *)GETPTR(a))->value;
            DEFPTR(om_list_data) lb = ((om_list *)GETPTR(b))->value;
            if (la->size() != lb->size())
                return (false);
            for (std::size_t i = 0; i < la->size(); i++)
            {
                if (!bool_value(equal((*la)[i], (*lb)[i])))
                    return (false);
            }
            DEFPTR(om_dict_data) da = ((om_list *)GETPTR(a))->props;
            DEFPTR(om_dict_data) db = ((om_list *)GETPTR(b))->props;
            std::vector<om_dict_key
        #if defined(OM_USE_GC)
                    , gc_allocator<om_dict_key>
        #endif
                    > a_keys;
            for (om_dict_data::iterator it = da->begin(); it != da->end(); ++it)
            {
                a_keys.push_back(it->first);
            }
            std::sort(a_keys.begin(), a_keys.end());
            std::vector<om_dict_key
        #if defined(OM_USE_GC)
                    , gc_allocator<om_dict_key>
        #endif
                    > b_keys;
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
            DEFPTR(om_dict_data) da = ((om_dict *)GETPTR(a))->value;
            DEFPTR(om_dict_data) db = ((om_dict *)GETPTR(b))->value;
            std::vector<om_dict_key
        #if defined(OM_USE_GC)
                    , gc_allocator<om_dict_key>
        #endif
                    > a_keys;
            for (om_dict_data::iterator it = da->begin(); it != da->end(); ++it)
            {
                a_keys.push_back(it->first);
            }
            std::sort(a_keys.begin(), a_keys.end());
            std::vector<om_dict_key
        #if defined(OM_USE_GC)
                    , gc_allocator<om_dict_key>
        #endif
                    > b_keys;
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

om_register_ptr eq(om_register_ptr a, om_register_ptr b)
{
    return new_bool(om::eq(a, b));
}
om_register_ptr equal(om_register_ptr a, om_register_ptr b)
{
    return new_bool(om::equal(a, b));
}
