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
        this->data = new_undefined();
    }
};

var var_print(var &x)
{
    ::print(x.data);
    return x;
}

#endif // OMVAR_H
