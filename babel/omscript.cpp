#include "omscript.h"

om_register::type om_register::type_of()
{
    return (type)-1;
}

std::string om_register::printable_text()
{
    return "?";
}

bool om_register::bool_value()
{
    return false;
}

double om_register::number_value()
{
    return 0;
}

const std::string om_register::string_value()
{
    static std::string empty = "";
    return empty;
}

void om_register::push(om_register_ptr x)
{
}

om_undefined::om_undefined()
{
}

om_register::type om_undefined::type_of()
{
    return UNDEFINED;
}

std::string om_undefined::printable_text()
{
    return "undefined";
}

const std::string om_undefined::string_value()
{
    return "undefined";
}

om_null::om_null()
{
}

om_register::type om_null::type_of()
{
    return NULL_;
}

std::string om_null::printable_text()
{
    return "null";
}

const std::string om_null::string_value()
{
    return "null";
}

bool bool_value(bool x)
{
    return x;
}

bool bool_value(om_register_ptr x)
{
    return x->bool_value();
}

bool bool_value(om_register *x)
{
    return x->bool_value();
}

double number_value(om_register_ptr x)
{
    return x->number_value();
}

double number_value(om_register *x)
{
    return x->number_value();
}

const std::string string_value(om_register_ptr x)
{
    return x->string_value();
}

const std::string string_value(om_register *x)
{
    return x->string_value();
}

const std::string printable_text(om_register_ptr x)
{
    return x->printable_text();
}

std::string stringify_sting(const std::string &s)
{
    std::string result = "\"";
    for (unsigned long long i = 0; i < s.size(); i++)
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

om_bool::om_bool(bool b) : value(b)
{
}

om_register::type om_bool::type_of()
{
    return BOOL;
}

std::string om_bool::printable_text()
{
    return this->string_value();
}

const std::string om_bool::string_value()
{
    static std::string false_ = "false";
    static std::string true_ = "true";
    return this->value ? true_ : false_;
}

bool om_bool::bool_value()
{
    return this->value;
}

double om_bool::number_value()
{
    return this->value ? 1 : 0;
}

om_number::om_number(double n) : value(n)
{
}

om_register::type om_number::type_of()
{
    return NUMBER;
}

std::string om_number::printable_text()
{
    return this->string_value();
}

double om_number::number_value()
{
    return this->value;
}

const std::string om_number::string_value()
{
    std::ostringstream stream;
    stream << this->value;
    return stream.str();
}

bool om_number::bool_value()
{
    static double nan = std::nan("");
    return !(this->value == 0 || this->value == nan);
}

om_string::om_string(const std::string &s) : value(s)
{
}

om_register::type om_string::type_of()
{
    return STRING;
}

std::string om_string::printable_text()
{
    return stringify_sting(this->value);
}

const std::string om_string::string_value()
{
    return this->value;
}

bool om_string::bool_value()
{
    return !this->value.empty();
}

om_list::om_list(om_list_data data, om_dict_data props)
{
    //if (data == nullptr)
    //    data = NEWPTR(om_list_data, ());
    this->value = data;
    //if (props == nullptr)
    //    props = NEWPTR(om_dict_data, ());
    this->props = props;
}

om_register::type om_list::type_of()
{
    return LIST;
}

std::string om_list::printable_text()
{
    std::string result = "( ";
    for (unsigned long long i = 0; i < this->value.size(); i++)
    {
        if (i > 0)
            result += " ";
        result += ::printable_text(this->value[i]);
    }
    std::vector<std::string> keys;
    for (om_dict_data::iterator it = this->props.begin(); it != this->props.end(); ++it)
    {
        keys.push_back(it->first);
    }
    std::sort(keys.begin(), keys.end());
    if (keys.size() > 0)
    {
        if (this->value.size() > 0)
            result += " ";
        result += "?";
        for (unsigned long long i = 0; i < keys.size(); i++)
        {
            std::string key = keys[i];
            result += " (";
            result += stringify_sting(std::string(key.begin(), key.end()));
            result += " ";
            result += ::printable_text(this->props.at(key));
            result += ")";
        }
    }
    result += " )";
    return result;
}

const std::string om_list::string_value()
{
    std::string result = "";
    for (unsigned long long i = 0; i < this->value.size(); i++)
    {
        if (i > 0)
            result += ",";
        result += ::string_value(this->value[i]);
    }
    return result;
}

bool om_list::bool_value()
{
    return true;
}

void om_list::push(om_register_ptr x)
{
    this->value.push_back(x);
}

om_dict::om_dict(om_dict_data data)
{
    //if (data == nullptr)
    //    data = NEWPTR(om_dict_data, ());
    this->props = data;
}

om_register::type om_dict::type_of()
{
    return DICTIONARY;
}

std::string om_dict::printable_text()
{
    std::string result = "{ ";
    std::vector<std::string> keys;
    for (om_dict_data::iterator it = this->props.begin(); it != this->props.end(); ++it)
    {
        keys.push_back(it->first);
    }
    std::sort(keys.begin(), keys.end());
    for (unsigned long long i = 0; i < keys.size(); i++)
    {
        std::string key = keys[i];
        if (i > 0)
            result += " ";
        result += stringify_sting(std::string(key.begin(), key.end()));
        result += " ";
        result += ::printable_text(this->props.at(key));
    }
    result += " }";
    return result;
}

const std::string om_dict::string_value()
{
    return "[object Object]";
}

bool om_dict::bool_value()
{
    return true;
}

om_func::om_func(om_func_def data) : value(data)
{
}

om_register::type om_func::type_of()
{
    return FUNCTION;
}

std::string om_func::printable_text()
{
    return "function";
}

const std::string om_func::string_value()
{
    return "function ?";
}

bool om_func::bool_value()
{
    return true;
}

om_register_ptr om_func::operator()(om_list_data __arguments__)
{
    return this->value(__arguments__);
}

om_register_ptr new_undefined()
{
    static DEFPTR(om_register) undefined = nullptr;
    if (!undefined)
        undefined = NEWPTR(om_undefined, ());
    return undefined;
}

om_register_ptr new_null()
{
    static DEFPTR(om_register) null = nullptr;
    if (!null)
        null = NEWPTR(om_null, ());
    return null;
}

om_register_ptr new_bool(bool b)
{
    static DEFPTR(om_register) true_ = nullptr;
    static DEFPTR(om_register) false_ = nullptr;
    if (!true_)
        true_ = NEWPTR(om_bool, (true));
    if (!false_)
        false_ = NEWPTR(om_bool, (false));
    return b ? true_ : false_;
}

om_register_ptr new_number(double n)
{
    return NEWPTR(om_number, (n));
}

om_register_ptr new_string(const std::string &s)
{
    return NEWPTR(om_string, (s));
}

om_register_ptr new_list(std::vector<om_register_ptr> args)
{
#if 0x0
    DEFPTR(om_list_data) data = NEWPTR(om_list_data, ());
    for (om_register_ptr i : args)
    {
        data->push_back(i);
    }
    return NEWPTR(om_list, (data));
#else
    return NEWPTR(om_list, (args));
#endif
}

om_register_ptr new_dict(om_dict_data data)
{
    return NEWPTR(om_dict, (data));
}

/*
om_register_ptr new_dict_pairs(std::vector<std::pair<std::string, om_register_ptr>> args)
{
#if 0x0
    DEFPTR(om_dict_data) data = NEWPTR(om_dict_data, ());
    for (std::pair<std::string, om_register_ptr > i : args)
    {
        data->insert(i);
    }
    return NEWPTR(om_dict, (data));
#else
    om_dict_data data;
    for (std::pair<std::string, om_register_ptr > i : data)
    {
        data.insert(i);
    }
    return NEWPTR(om_dict, (data));
#endif
}
*/

om_register_ptr new_func(om_func_def def)
{
    return NEWPTR(om_func, (def));
}

om_register_ptr get_arg(om_list_data &args, unsigned long long index)
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

om_register_ptr &om_register::operator[](om_register_ptr index)
{
    //static om_register_ptr dummy = new_undefined();
    static om_register_ptr dummy = new_number(123);
    return dummy;
}

om_register_ptr &om_list::operator[](om_register_ptr index)
{
    if (index->type_of() != om_register::type::NUMBER)
    {
        std::string key = ::string_value(index);
        throw std::runtime_error("string index not supported");
    }
    double n = ::number_value(index);
    unsigned long long i = (unsigned long long)n;
    if (i != n)
        throw std::runtime_error("float index not supported");
    if (i < 0 || i >= this->value.size())
        throw std::runtime_error("index out of range(1)");
    return this->value[i];
}

om_register_ptr print(om_register_ptr x)
{
    std::cout << printable_text(x) << std::endl;
    return x;
}

bool om::eq(om_register_ptr a, om_register_ptr b)
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

bool om::equal(om_register_ptr a, om_register_ptr b)
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
#if 0x0
        DEFPTR(om_list_data) la = ((om_list *)GETPTR(a))->value;
        DEFPTR(om_list_data) lb = ((om_list *)GETPTR(b))->value;
#else
        om_list_data *la = &((om_list *)GETPTR(a))->value;
        om_list_data *lb = &((om_list *)GETPTR(b))->value;
#endif
        if (la->size() != lb->size())
            return (false);
        for (unsigned long long i = 0; i < la->size(); i++)
        {
            if (!bool_value(om::equal((*la)[i], (*lb)[i])))
                return (false);
        }
#if 0x0
        DEFPTR(om_dict_data) da = ((om_list *)GETPTR(a))->props;
        DEFPTR(om_dict_data) db = ((om_list *)GETPTR(b))->props;
#else
        om_dict_data *da = &((om_list *)GETPTR(a))->props;
        om_dict_data *db = &((om_list *)GETPTR(b))->props;
#endif
        std::vector<std::string> a_keys;
        for (om_dict_data::iterator it = da->begin(); it != da->end(); ++it)
        {
            a_keys.push_back(it->first);
        }
        std::sort(a_keys.begin(), a_keys.end());
        std::vector<std::string> b_keys;
        for (om_dict_data::iterator it = db->begin(); it != db->end(); ++it)
        {
            b_keys.push_back(it->first);
        }
        std::sort(b_keys.begin(), b_keys.end());
        if (a_keys != b_keys)
            return (false);
        for (unsigned long long i = 0; i < a_keys.size(); i++)
        {
            std::string key = a_keys[i];
            if (!bool_value(om::equal(da->at(key), db->at(key))))
                return (false);
        }
        return (true);
    }
        break;
    case om_register::type::DICTIONARY:
    {
#if 0x0
        DEFPTR(om_dict_data) da = ((om_dict *)GETPTR(a))->props;
        DEFPTR(om_dict_data) db = ((om_dict *)GETPTR(b))->props;
#else
        om_dict_data *da = &((om_dict *)GETPTR(a))->props;
        om_dict_data *db = &((om_dict *)GETPTR(b))->props;
#endif
        std::vector<std::string> a_keys;
        for (om_dict_data::iterator it = da->begin(); it != da->end(); ++it)
        {
            a_keys.push_back(it->first);
        }
        std::sort(a_keys.begin(), a_keys.end());
        std::vector<std::string> b_keys;
        for (om_dict_data::iterator it = db->begin(); it != db->end(); ++it)
        {
            b_keys.push_back(it->first);
        }
        std::sort(b_keys.begin(), b_keys.end());
        if (a_keys != b_keys)
            return (false);
        for (unsigned long long i = 0; i < a_keys.size(); i++)
        {
            std::string key = a_keys[i];
            if (!bool_value(om::equal(da->at(key), db->at(key))))
                return (false);
        }
        return (true);
    }
        break;
    }
    return (false);
}

om_register_ptr eq(om_register_ptr a, om_register_ptr b)
{
    return new_bool(om::eq(a, b));
}

om_register_ptr equal(om_register_ptr a, om_register_ptr b)
{
    return new_bool(om::equal(a, b));
}
