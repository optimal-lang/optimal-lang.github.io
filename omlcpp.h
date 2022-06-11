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

class oml_root : public gc_cleanup
{
public:
    enum type
    {
        BOOL,
        NUMBER,
        STRING,
        LIST,
        DICT
    };
    virtual type type_of() = 0;
    virtual std::string printable_text() = 0;
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
    virtual void push(oml_root *x)
    {
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

static inline const std::string printable_text(oml_root *x)
{
    static std::string null_ = "null";
    static std::string undefined_ = "undefined";
    if (x == nullptr)
        return null_;
    if (x == undefined)
        return undefined_;
    return x->printable_text();
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

class oml_bool : public oml_root
{
    bool value;

public:
    oml_bool(bool b) : value(b)
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
};

class oml_number : public oml_root
{
    double value;

public:
    oml_number(double n) : value(n)
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

class oml_string : public oml_root
{
    std::string value;

public:
    oml_string(const std::string &s) : value(s)
    {
    }
    virtual type type_of()
    {
        return STRING;
    }
    virtual std::string printable_text()
    {
        return stringify_sting(this->value);
        /*
        std::string s = "\"";
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
        */
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
    {
        if (data == nullptr)
            data = new (GC) oml_list_data();
        this->value = data;
    }
    virtual type type_of()
    {
        return LIST;
    }
    virtual std::string printable_text()
    {
        return this->string_value();
    }
    virtual const std::string string_value()
    {
        std::string result = "( ";
        for (std::size_t i = 0; i < this->value->size(); i++)
        {
            if (i > 0)
                result += " ";
            result += ::printable_text((*this->value)[i]);
        }
        result += " )";
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
    friend oml_root *equal(oml_root *a, oml_root *b);
};

using oml_dict_key = std::basic_string<char, std::char_traits<char>, gc_allocator<char>>;
using oml_dict_data = std::map<oml_dict_key, oml_root *, std::less<oml_dict_key>, gc_allocator<std::pair<oml_root *, oml_root *>>>;

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
    virtual type type_of()
    {
        return DICT;
    }
    virtual std::string printable_text()
    {
        return this->string_value();
    }
    virtual const std::string string_value()
    {
        std::string result = "{ ";
        //std::size_t i = 0;
        std::vector<oml_dict_key, gc_allocator<oml_dict_key>> keys;
        for (oml_dict_data::iterator it = this->value->begin(); it != this->value->end(); ++it)
        {
            keys.push_back(it->first);
        }
        std::sort(keys.begin(), keys.end());
        for (std::size_t i = 0; i < keys.size(); i++)
        {
            oml_dict_key key = keys[i];
            if (i > 0)
                result += " ";
            result += stringify_sting(std::string(key.begin(), key.end()));
            result += " ";
            result += ::printable_text(this->value->at(key));
        }
        result += " }";
        return result;
    }
    virtual bool bool_value()
    {
        return true;
    }
    friend oml_root *equal(oml_root *a, oml_root *b);
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

oml_root *console_log(oml_root *x)
{
    std::cout << string_value(x) << std::endl;
    return null;
}

oml_root *print(oml_root *x)
{
    std::cout << printable_text(x) << std::endl;
    return x;
}

oml_root *equal(oml_root *a, oml_root *b)
{
    if (a == null)
        return new_bool(b == null);
    if (a == undefined)
        return new_bool(b == undefined);
    if (a == null || a == undefined || b == null || b == undefined)
        return new_bool(false);
    if (a->type_of() != b->type_of())
        return new_bool(false);
    switch (a->type_of())
    {
    case oml_root::type::BOOL:
        return new_bool(bool_value(a) == bool_value(b));
        break;
    case oml_root::type::NUMBER:
        return new_bool(number_value(a) == number_value(b));
        break;
    case oml_root::type::STRING:
        return new_bool(string_value(a) == string_value(b));
        break;
    case oml_root::type::LIST:
    {
        oml_list_data *la = ((oml_list *)a)->value;
        oml_list_data *lb = ((oml_list *)b)->value;
        if (la->size() != lb->size())
            return new_bool(false);
        for (std::size_t i = 0; i < la->size(); i++)
        {
            //print((*la)[i]);
            //print((*lb)[i]);
            if (!bool_value(equal((*la)[i], (*lb)[i])))
                return new_bool(false);
        }
        return new_bool(true);
    }
    break;
    case oml_root::type::DICT:
    {
        oml_dict_data *da = ((oml_dict *)a)->value;
        oml_dict_data *db = ((oml_dict *)b)->value;
        std::vector<oml_dict_key, gc_allocator<oml_dict_key>> a_keys;
        for (oml_dict_data::iterator it = da->begin(); it != da->end(); ++it)
        {
            a_keys.push_back(it->first);
        }
        std::sort(a_keys.begin(), a_keys.end());
        std::vector<oml_dict_key, gc_allocator<oml_dict_key>> b_keys;
        for (oml_dict_data::iterator it = db->begin(); it != db->end(); ++it)
        {
            b_keys.push_back(it->first);
        }
        std::sort(b_keys.begin(), b_keys.end());
        if (a_keys != b_keys) return new_bool(false);
        for (std::size_t i = 0; i < a_keys.size(); i++)
        {
            oml_dict_key key = a_keys[i];
            if (!bool_value(equal(da->at(key), db->at(key)))) return new_bool(false);
        }
        return new_bool(true);
    }
    break;
    }
    return new_bool(false);
}
