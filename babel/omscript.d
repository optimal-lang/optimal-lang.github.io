/* ----------------------------------------------------------------------------
 * This file was automatically generated by SWIG (http://www.swig.org).
 * Version 4.0.2
 *
 * Do not make changes to this file unless you know what you are doing--modify
 * the SWIG interface file instead.
 * ----------------------------------------------------------------------------- */

module omscript;

static import omscript_im;
static import core.stdc.config;

static import std.conv;
static import std.string;

static import std.conv;
static import std.string;

static import std.algorithm;
static import std.exception;
static import std.range;
static import std.traits;


class om_data {
  private void* swigCPtr;
  protected bool swigCMemOwn;

  public this(void* cObject, bool ownCObject) {
    swigCPtr = cObject;
    swigCMemOwn = ownCObject;
  }

  public static void* swigGetCPtr(typeof(this) obj) {
    return (obj is null) ? null : obj.swigCPtr;
  }

  mixin omscript_im.SwigOperatorDefinitions;

  ~this() {
    dispose();
  }

  public void dispose() {
    synchronized(this) {
      if (swigCPtr !is null) {
        if (swigCMemOwn) {
          swigCMemOwn = false;
          omscript_im.delete_om_data(cast(void*)swigCPtr);
        }
        swigCPtr = null;
      }
    }
  }

  public this() {
    this(omscript_im.new_om_data(), true);
  }
}

class om_register {
  private void* swigCPtr;
  protected bool swigCMemOwn;

  public this(void* cObject, bool ownCObject) {
    swigCPtr = cObject;
    swigCMemOwn = ownCObject;
  }

  public static void* swigGetCPtr(typeof(this) obj) {
    return (obj is null) ? null : obj.swigCPtr;
  }

  mixin omscript_im.SwigOperatorDefinitions;

  ~this() {
    dispose();
  }

  public void dispose() {
    synchronized(this) {
      if (swigCPtr !is null) {
        if (swigCMemOwn) {
          swigCMemOwn = false;
          omscript_im.delete_om_register(cast(void*)swigCPtr);
        }
        swigCPtr = null;
      }
    }
  }

  enum type {
    UNDEFINED,
    NULL_,
    BOOL,
    NUMBER,
    STRING,
    LIST,
    DICTIONARY,
    FUNCTION
  }

  public om_register.type type_of() {
    om_register.type ret = cast(om_register.type)omscript_im.om_register_type_of(cast(void*)swigCPtr);
    return ret;
  }

  public string printable_text() {
    string ret = std.conv.to!string(omscript_im.om_register_printable_text(cast(void*)swigCPtr));
    return ret;
  }

  public bool bool_value() {
    bool ret = omscript_im.om_register_bool_value(cast(void*)swigCPtr) ? true : false;
    return ret;
  }

  public double number_value() {
    auto ret = omscript_im.om_register_number_value(cast(void*)swigCPtr);
    return ret;
  }

  public string string_value() {
    string ret = std.conv.to!string(omscript_im.om_register_string_value(cast(void*)swigCPtr));
    return ret;
  }

  public void push(om_data x) {
    omscript_im.om_register_push(cast(void*)swigCPtr, om_data.swigGetCPtr(x));
    if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
  }

  public om_data swigOpAdd(om_register other) {
    om_data ret = new om_data(omscript_im.om_register_swigOpAdd(cast(void*)swigCPtr, om_register.swigGetCPtr(other)), true);
    if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
    return ret;
  }

  public om_data opCall(om_list_data __arguments__) {
    om_data ret = new om_data(omscript_im.om_register_opCall(cast(void*)swigCPtr, om_list_data.swigGetCPtr(__arguments__)), true);
    if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
    return ret;
  }

  public om_data opIndex(om_data index) {
    om_data ret = new om_data(omscript_im.om_register_opIndex(cast(void*)swigCPtr, om_data.swigGetCPtr(index)), false);
    if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
    return ret;
  }

  public this() {
    this(omscript_im.new_om_register(), true);
  }
}

class om_undefined : om_register {
  private void* swigCPtr;

  public this(void* cObject, bool ownCObject) {
    super(omscript_im.om_undefined_Upcast(cObject), ownCObject);
    swigCPtr = cObject;
  }

  public static void* swigGetCPtr(typeof(this) obj) {
    return (obj is null) ? null : obj.swigCPtr;
  }

  mixin omscript_im.SwigOperatorDefinitions;

  ~this() {
    dispose();
  }

  public override void dispose() {
    synchronized(this) {
      if (swigCPtr !is null) {
        if (swigCMemOwn) {
          swigCMemOwn = false;
          omscript_im.delete_om_undefined(cast(void*)swigCPtr);
        }
        swigCPtr = null;
        super.dispose();
      }
    }
  }

  public this() {
    this(omscript_im.new_om_undefined(), true);
  }

  public override om_register.type type_of() {
    om_register.type ret = cast(om_register.type)omscript_im.om_undefined_type_of(cast(void*)swigCPtr);
    return ret;
  }

  public override string printable_text() {
    string ret = std.conv.to!string(omscript_im.om_undefined_printable_text(cast(void*)swigCPtr));
    return ret;
  }

  public override string string_value() {
    string ret = std.conv.to!string(omscript_im.om_undefined_string_value(cast(void*)swigCPtr));
    return ret;
  }
}

class om_null : om_register {
  private void* swigCPtr;

  public this(void* cObject, bool ownCObject) {
    super(omscript_im.om_null_Upcast(cObject), ownCObject);
    swigCPtr = cObject;
  }

  public static void* swigGetCPtr(typeof(this) obj) {
    return (obj is null) ? null : obj.swigCPtr;
  }

  mixin omscript_im.SwigOperatorDefinitions;

  ~this() {
    dispose();
  }

  public override void dispose() {
    synchronized(this) {
      if (swigCPtr !is null) {
        if (swigCMemOwn) {
          swigCMemOwn = false;
          omscript_im.delete_om_null(cast(void*)swigCPtr);
        }
        swigCPtr = null;
        super.dispose();
      }
    }
  }

  public this() {
    this(omscript_im.new_om_null(), true);
  }

  public override om_register.type type_of() {
    om_register.type ret = cast(om_register.type)omscript_im.om_null_type_of(cast(void*)swigCPtr);
    return ret;
  }

  public override string printable_text() {
    string ret = std.conv.to!string(omscript_im.om_null_printable_text(cast(void*)swigCPtr));
    return ret;
  }

  public override string string_value() {
    string ret = std.conv.to!string(omscript_im.om_null_string_value(cast(void*)swigCPtr));
    return ret;
  }
}

bool bool_value(bool x) {
  bool ret = omscript_im.bool_value__SWIG_0(x) ? true : false;
  return ret;
}

bool bool_value(om_data x) {
  bool ret = omscript_im.bool_value__SWIG_1(om_data.swigGetCPtr(x)) ? true : false;
  if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
  return ret;
}

bool bool_value(om_register x) {
  bool ret = omscript_im.bool_value__SWIG_2(om_register.swigGetCPtr(x)) ? true : false;
  return ret;
}

double number_value(om_data x) {
  auto ret = omscript_im.number_value__SWIG_0(om_data.swigGetCPtr(x));
  if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
  return ret;
}

double number_value(om_register x) {
  auto ret = omscript_im.number_value__SWIG_1(om_register.swigGetCPtr(x));
  return ret;
}

string string_value(om_data x) {
  string ret = std.conv.to!string(omscript_im.string_value__SWIG_0(om_data.swigGetCPtr(x)));
  if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
  return ret;
}

string string_value(om_register x) {
  string ret = std.conv.to!string(omscript_im.string_value__SWIG_1(om_register.swigGetCPtr(x)));
  return ret;
}

string printable_text(om_data x) {
  string ret = std.conv.to!string(omscript_im.printable_text(om_data.swigGetCPtr(x)));
  if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
  return ret;
}

string stringify_sting(string s) {
  string ret = std.conv.to!string(omscript_im.stringify_sting((s ? std.string.toStringz(s) : null)));
  if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
  return ret;
}

class om_bool : om_register {
  private void* swigCPtr;

  public this(void* cObject, bool ownCObject) {
    super(omscript_im.om_bool_Upcast(cObject), ownCObject);
    swigCPtr = cObject;
  }

  public static void* swigGetCPtr(typeof(this) obj) {
    return (obj is null) ? null : obj.swigCPtr;
  }

  mixin omscript_im.SwigOperatorDefinitions;

  ~this() {
    dispose();
  }

  public override void dispose() {
    synchronized(this) {
      if (swigCPtr !is null) {
        if (swigCMemOwn) {
          swigCMemOwn = false;
          omscript_im.delete_om_bool(cast(void*)swigCPtr);
        }
        swigCPtr = null;
        super.dispose();
      }
    }
  }

  public this(bool b) {
    this(omscript_im.new_om_bool(b), true);
  }

  public override om_register.type type_of() {
    om_register.type ret = cast(om_register.type)omscript_im.om_bool_type_of(cast(void*)swigCPtr);
    return ret;
  }

  public override string printable_text() {
    string ret = std.conv.to!string(omscript_im.om_bool_printable_text(cast(void*)swigCPtr));
    return ret;
  }

  public override string string_value() {
    string ret = std.conv.to!string(omscript_im.om_bool_string_value(cast(void*)swigCPtr));
    return ret;
  }

  public override bool bool_value() {
    bool ret = omscript_im.om_bool_bool_value(cast(void*)swigCPtr) ? true : false;
    return ret;
  }

  public override double number_value() {
    auto ret = omscript_im.om_bool_number_value(cast(void*)swigCPtr);
    return ret;
  }
}

class om_number : om_register {
  private void* swigCPtr;

  public this(void* cObject, bool ownCObject) {
    super(omscript_im.om_number_Upcast(cObject), ownCObject);
    swigCPtr = cObject;
  }

  public static void* swigGetCPtr(typeof(this) obj) {
    return (obj is null) ? null : obj.swigCPtr;
  }

  mixin omscript_im.SwigOperatorDefinitions;

  ~this() {
    dispose();
  }

  public override void dispose() {
    synchronized(this) {
      if (swigCPtr !is null) {
        if (swigCMemOwn) {
          swigCMemOwn = false;
          omscript_im.delete_om_number(cast(void*)swigCPtr);
        }
        swigCPtr = null;
        super.dispose();
      }
    }
  }

  public this(double n) {
    this(omscript_im.new_om_number(n), true);
  }

  public override om_register.type type_of() {
    om_register.type ret = cast(om_register.type)omscript_im.om_number_type_of(cast(void*)swigCPtr);
    return ret;
  }

  public override string printable_text() {
    string ret = std.conv.to!string(omscript_im.om_number_printable_text(cast(void*)swigCPtr));
    return ret;
  }

  public override double number_value() {
    auto ret = omscript_im.om_number_number_value(cast(void*)swigCPtr);
    return ret;
  }

  public override string string_value() {
    string ret = std.conv.to!string(omscript_im.om_number_string_value(cast(void*)swigCPtr));
    return ret;
  }

  public override bool bool_value() {
    bool ret = omscript_im.om_number_bool_value(cast(void*)swigCPtr) ? true : false;
    return ret;
  }
}

class om_string : om_register {
  private void* swigCPtr;

  public this(void* cObject, bool ownCObject) {
    super(omscript_im.om_string_Upcast(cObject), ownCObject);
    swigCPtr = cObject;
  }

  public static void* swigGetCPtr(typeof(this) obj) {
    return (obj is null) ? null : obj.swigCPtr;
  }

  mixin omscript_im.SwigOperatorDefinitions;

  ~this() {
    dispose();
  }

  public override void dispose() {
    synchronized(this) {
      if (swigCPtr !is null) {
        if (swigCMemOwn) {
          swigCMemOwn = false;
          omscript_im.delete_om_string(cast(void*)swigCPtr);
        }
        swigCPtr = null;
        super.dispose();
      }
    }
  }

  public this(string s) {
    this(omscript_im.new_om_string((s ? std.string.toStringz(s) : null)), true);
    if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
  }

  public override om_register.type type_of() {
    om_register.type ret = cast(om_register.type)omscript_im.om_string_type_of(cast(void*)swigCPtr);
    return ret;
  }

  public override string printable_text() {
    string ret = std.conv.to!string(omscript_im.om_string_printable_text(cast(void*)swigCPtr));
    return ret;
  }

  public override string string_value() {
    string ret = std.conv.to!string(omscript_im.om_string_string_value(cast(void*)swigCPtr));
    return ret;
  }

  public override bool bool_value() {
    bool ret = omscript_im.om_string_bool_value(cast(void*)swigCPtr) ? true : false;
    return ret;
  }
}

class om_list : om_register {
  private void* swigCPtr;

  public this(void* cObject, bool ownCObject) {
    super(omscript_im.om_list_Upcast(cObject), ownCObject);
    swigCPtr = cObject;
  }

  public static void* swigGetCPtr(typeof(this) obj) {
    return (obj is null) ? null : obj.swigCPtr;
  }

  mixin omscript_im.SwigOperatorDefinitions;

  ~this() {
    dispose();
  }

  public override void dispose() {
    synchronized(this) {
      if (swigCPtr !is null) {
        if (swigCMemOwn) {
          swigCMemOwn = false;
          omscript_im.delete_om_list(cast(void*)swigCPtr);
        }
        swigCPtr = null;
        super.dispose();
      }
    }
  }

  public this(om_list_data data, om_dict_data props) {
    this(omscript_im.new_om_list__SWIG_0(om_list_data.swigGetCPtr(data), om_dict_data.swigGetCPtr(props)), true);
    if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
  }

  public this(om_list_data data) {
    this(omscript_im.new_om_list__SWIG_1(om_list_data.swigGetCPtr(data)), true);
    if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
  }

  public this() {
    this(omscript_im.new_om_list__SWIG_2(), true);
  }

  public override om_register.type type_of() {
    om_register.type ret = cast(om_register.type)omscript_im.om_list_type_of(cast(void*)swigCPtr);
    return ret;
  }

  public override string printable_text() {
    string ret = std.conv.to!string(omscript_im.om_list_printable_text(cast(void*)swigCPtr));
    return ret;
  }

  public override string string_value() {
    string ret = std.conv.to!string(omscript_im.om_list_string_value(cast(void*)swigCPtr));
    return ret;
  }

  public override bool bool_value() {
    bool ret = omscript_im.om_list_bool_value(cast(void*)swigCPtr) ? true : false;
    return ret;
  }

  public override void push(om_data x) {
    omscript_im.om_list_push(cast(void*)swigCPtr, om_data.swigGetCPtr(x));
    if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
  }

  public override om_data opIndex(om_data index) {
    om_data ret = new om_data(omscript_im.om_list_opIndex(cast(void*)swigCPtr, om_data.swigGetCPtr(index)), false);
    if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
    return ret;
  }
}

class om_dict : om_register {
  private void* swigCPtr;

  public this(void* cObject, bool ownCObject) {
    super(omscript_im.om_dict_Upcast(cObject), ownCObject);
    swigCPtr = cObject;
  }

  public static void* swigGetCPtr(typeof(this) obj) {
    return (obj is null) ? null : obj.swigCPtr;
  }

  mixin omscript_im.SwigOperatorDefinitions;

  ~this() {
    dispose();
  }

  public override void dispose() {
    synchronized(this) {
      if (swigCPtr !is null) {
        if (swigCMemOwn) {
          swigCMemOwn = false;
          omscript_im.delete_om_dict(cast(void*)swigCPtr);
        }
        swigCPtr = null;
        super.dispose();
      }
    }
  }

  public this(om_dict_data data) {
    this(omscript_im.new_om_dict__SWIG_0(om_dict_data.swigGetCPtr(data)), true);
    if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
  }

  public this() {
    this(omscript_im.new_om_dict__SWIG_1(), true);
  }

  public override om_register.type type_of() {
    om_register.type ret = cast(om_register.type)omscript_im.om_dict_type_of(cast(void*)swigCPtr);
    return ret;
  }

  public override string printable_text() {
    string ret = std.conv.to!string(omscript_im.om_dict_printable_text(cast(void*)swigCPtr));
    return ret;
  }

  public override string string_value() {
    string ret = std.conv.to!string(omscript_im.om_dict_string_value(cast(void*)swigCPtr));
    return ret;
  }

  public override bool bool_value() {
    bool ret = omscript_im.om_dict_bool_value(cast(void*)swigCPtr) ? true : false;
    return ret;
  }
}

class om_func : om_register {
  private void* swigCPtr;

  public this(void* cObject, bool ownCObject) {
    super(omscript_im.om_func_Upcast(cObject), ownCObject);
    swigCPtr = cObject;
  }

  public static void* swigGetCPtr(typeof(this) obj) {
    return (obj is null) ? null : obj.swigCPtr;
  }

  mixin omscript_im.SwigOperatorDefinitions;

  ~this() {
    dispose();
  }

  public override void dispose() {
    synchronized(this) {
      if (swigCPtr !is null) {
        if (swigCMemOwn) {
          swigCMemOwn = false;
          omscript_im.delete_om_func(cast(void*)swigCPtr);
        }
        swigCPtr = null;
        super.dispose();
      }
    }
  }

  public this(SWIGTYPE_p_f_om_list_data__std__shared_ptrT_om_register_t data) {
    this(omscript_im.new_om_func__SWIG_0(SWIGTYPE_p_f_om_list_data__std__shared_ptrT_om_register_t.swigGetCPtr(data)), true);
  }

  public this(SWIGTYPE_p_std__functionT_std__shared_ptrT_om_register_t_fom_list_dataF_t data) {
    this(omscript_im.new_om_func__SWIG_1(SWIGTYPE_p_std__functionT_std__shared_ptrT_om_register_t_fom_list_dataF_t.swigGetCPtr(data)), true);
    if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
  }

  public override om_register.type type_of() {
    om_register.type ret = cast(om_register.type)omscript_im.om_func_type_of(cast(void*)swigCPtr);
    return ret;
  }

  public override string printable_text() {
    string ret = std.conv.to!string(omscript_im.om_func_printable_text(cast(void*)swigCPtr));
    return ret;
  }

  public override string string_value() {
    string ret = std.conv.to!string(omscript_im.om_func_string_value(cast(void*)swigCPtr));
    return ret;
  }

  public override bool bool_value() {
    bool ret = omscript_im.om_func_bool_value(cast(void*)swigCPtr) ? true : false;
    return ret;
  }

  public override om_data opCall(om_list_data __arguments__) {
    om_data ret = new om_data(omscript_im.om_func_opCall(cast(void*)swigCPtr, om_list_data.swigGetCPtr(__arguments__)), true);
    if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
    return ret;
  }
}

om_data new_undefined() {
  om_data ret = new om_data(omscript_im.new_undefined(), true);
  return ret;
}

om_data new_null() {
  om_data ret = new om_data(omscript_im.new_null(), true);
  return ret;
}

om_data new_bool(bool b) {
  om_data ret = new om_data(omscript_im.new_bool(b), true);
  return ret;
}

om_data new_number(double n) {
  om_data ret = new om_data(omscript_im.new_number(n), true);
  return ret;
}

om_data new_string(string s) {
  om_data ret = new om_data(omscript_im.new_string((s ? std.string.toStringz(s) : null)), true);
  if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
  return ret;
}

om_data new_list(om_list_data array, om_dict_data props) {
  om_data ret = new om_data(omscript_im.new_list__SWIG_0(om_list_data.swigGetCPtr(array), om_dict_data.swigGetCPtr(props)), true);
  if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
  return ret;
}

om_data new_list(om_list_data array) {
  om_data ret = new om_data(omscript_im.new_list__SWIG_1(om_list_data.swigGetCPtr(array)), true);
  if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
  return ret;
}

om_data new_list() {
  om_data ret = new om_data(omscript_im.new_list__SWIG_2(), true);
  return ret;
}

om_data new_dict(om_dict_data data) {
  om_data ret = new om_data(omscript_im.new_dict(om_dict_data.swigGetCPtr(data)), true);
  if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
  return ret;
}

om_data new_func(SWIGTYPE_p_f_om_list_data__std__shared_ptrT_om_register_t callback) {
  om_data ret = new om_data(omscript_im.new_func__SWIG_0(SWIGTYPE_p_f_om_list_data__std__shared_ptrT_om_register_t.swigGetCPtr(callback)), true);
  return ret;
}

om_data new_func(SWIGTYPE_p_std__functionT_std__shared_ptrT_om_register_t_fom_list_dataF_t def) {
  om_data ret = new om_data(omscript_im.new_func__SWIG_1(SWIGTYPE_p_std__functionT_std__shared_ptrT_om_register_t_fom_list_dataF_t.swigGetCPtr(def)), true);
  if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
  return ret;
}

om_data get_arg(om_list_data args, long index) {
  om_data ret = new om_data(omscript_im.get_arg(om_list_data.swigGetCPtr(args), index), true);
  if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
  return ret;
}

om_data print(om_data x) {
  om_data ret = new om_data(omscript_im.print(om_data.swigGetCPtr(x)), true);
  if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
  return ret;
}

om_data eq(om_data a, om_data b) {
  om_data ret = new om_data(omscript_im.eq(om_data.swigGetCPtr(a), om_data.swigGetCPtr(b)), true);
  if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
  return ret;
}

om_data equal(om_data a, om_data b) {
  om_data ret = new om_data(omscript_im.equal(om_data.swigGetCPtr(a), om_data.swigGetCPtr(b)), true);
  if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
  return ret;
}

class om_list_data {
  private void* swigCPtr;
  protected bool swigCMemOwn;

  public this(void* cObject, bool ownCObject) {
    swigCPtr = cObject;
    swigCMemOwn = ownCObject;
  }

  public static void* swigGetCPtr(typeof(this) obj) {
    return (obj is null) ? null : obj.swigCPtr;
  }

  mixin omscript_im.SwigOperatorDefinitions;

  ~this() {
    dispose();
  }

  public void dispose() {
    synchronized(this) {
      if (swigCPtr !is null) {
        if (swigCMemOwn) {
          swigCMemOwn = false;
          omscript_im.delete_om_list_data(cast(void*)swigCPtr);
        }
        swigCPtr = null;
      }
    }
  }

  alias size_t KeyType;
  alias om_data ValueType;

  this(ValueType[] values...) {
    this();
    reserve(values.length);
    foreach (e; values) {
      this ~= e;
    }
  }

  struct Range {
    private om_list_data _outer;
    private size_t _a, _b;

    this(om_list_data data, size_t a, size_t b) {
      _outer = data;
      _a = a;
      _b = b;
    }

    @property bool empty() const {
      assert((cast(om_list_data)_outer).length >= _b);
      return _a >= _b;
    }

    @property Range save() {
      return this;
    }

    @property ValueType front() {
      std.exception.enforce(!empty);
      return _outer[_a];
    }

    @property void front(ValueType value) {
      std.exception.enforce(!empty);
      _outer[_a] = std.algorithm.move(value);
    }

    void popFront() {
      std.exception.enforce(!empty);
      ++_a;
    }

    void opIndexAssign(ValueType value, size_t i) {
      i += _a;
      std.exception.enforce(i < _b && _b <= _outer.length);
      _outer[i] = value;
    }

    void opIndexOpAssign(string op)(ValueType value, size_t i) {
      std.exception.enforce(_outer && _a + i < _b && _b <= _outer.length);
      auto element = _outer[i];
      mixin("element "~op~"= value;");
      _outer[i] = element;
    }
  }

  // TODO: dup?

  Range opSlice() {
    return Range(this, 0, length);
  }

  Range opSlice(size_t a, size_t b) {
    std.exception.enforce(a <= b && b <= length);
    return Range(this, a, b);
  }

  size_t opDollar() const {
    return length;
  }

  @property ValueType front() {
    std.exception.enforce(!empty);
    return getElement(0);
  }

  @property void front(ValueType value) {
    std.exception.enforce(!empty);
    setElement(0, value);
  }

  @property ValueType back() {
    std.exception.enforce(!empty);
    return getElement(length - 1);
  }

  @property void back(ValueType value) {
    std.exception.enforce(!empty);
    setElement(length - 1, value);
  }

  ValueType opIndex(size_t i) {
    return getElement(i);
  }

  void opIndexAssign(ValueType value, size_t i) {
    setElement(i, value);
  }

  void opIndexOpAssign(string op)(ValueType value, size_t i) {
    auto element = this[i];
    mixin("element "~op~"= value;");
    this[i] = element;
  }

  ValueType[] opBinary(string op, Stuff)(Stuff stuff) if (op == "~") {
    ValueType[] result;
    result ~= this[];
    assert(result.length == length);
    result ~= stuff[];
    return result;
  }

  void opOpAssign(string op, Stuff)(Stuff stuff) if (op == "~") {
    static if (is(typeof(insertBack(stuff)))) {
      insertBack(stuff);
    } else if (is(typeof(insertBack(stuff[])))) {
      insertBack(stuff[]);
    } else {
      static assert(false, "Cannot append " ~ Stuff.stringof ~ " to " ~ typeof(this).stringof);
    }
  }

  alias size length;

  alias remove removeAny;
  alias removeAny stableRemoveAny;

  size_t insertBack(Stuff)(Stuff stuff)
  if (std.traits.isImplicitlyConvertible!(Stuff, ValueType)){
    push_back(stuff);
    return 1;
  }
  size_t insertBack(Stuff)(Stuff stuff)
  if (std.range.isInputRange!Stuff &&
      std.traits.isImplicitlyConvertible!(std.range.ElementType!Stuff, ValueType)) {
    size_t itemCount;
    foreach(item; stuff) {
      insertBack(item);
      ++itemCount;
    }
    return itemCount;
  }
  alias insertBack insert;

  alias pop_back removeBack;
  alias pop_back stableRemoveBack;

  size_t insertBefore(Stuff)(Range r, Stuff stuff)
  if (std.traits.isImplicitlyConvertible!(Stuff, ValueType)) {
    std.exception.enforce(r._outer.swigCPtr == swigCPtr && r._a < length);
    insertAt(r._a, stuff);
    return 1;
  }

  size_t insertBefore(Stuff)(Range r, Stuff stuff)
  if (std.range.isInputRange!Stuff && std.traits.isImplicitlyConvertible!(ElementType!Stuff, ValueType)) {
    std.exception.enforce(r._outer.swigCPtr == swigCPtr && r._a <= length);

    size_t insertCount;
    foreach(i, item; stuff) {
      insertAt(r._a + i, item);
      ++insertCount;
    }

    return insertCount;
  }

  size_t insertAfter(Stuff)(Range r, Stuff stuff) {
    // TODO: optimize
    immutable offset = r._a + r.length;
    std.exception.enforce(offset <= length);
    auto result = insertBack(stuff);
    std.algorithm.bringToFront(this[offset .. length - result],
      this[length - result .. length]);
    return result;
  }

  size_t replace(Stuff)(Range r, Stuff stuff)
  if (std.range.isInputRange!Stuff &&
      std.traits.isImplicitlyConvertible!(ElementType!Stuff, ValueType)) {
    immutable offset = r._a;
    std.exception.enforce(offset <= length);
    size_t result;
    for (; !stuff.empty; stuff.popFront()) {
      if (r.empty) {
        // append the rest
        return result + insertBack(stuff);
      }
      r.front = stuff.front;
      r.popFront();
      ++result;
    }
    // Remove remaining stuff in r
    remove(r);
    return result;
  }

  size_t replace(Stuff)(Range r, Stuff stuff)
  if (std.traits.isImplicitlyConvertible!(Stuff, ValueType))
  {
      if (r.empty)
      {
          insertBefore(r, stuff);
      }
      else
      {
          r.front = stuff;
          r.popFront();
          remove(r);
      }
      return 1;
  }

  Range linearRemove(Range r) {
    std.exception.enforce(r._a <= r._b && r._b <= length);
    immutable tailLength = length - r._b;
    linearRemove(r._a, r._b);
    return this[length - tailLength .. length];
  }
  alias remove stableLinearRemove;

  int opApply(int delegate(ref om_data value) dg) {
    int result;

    size_t currentSize = size();
    for (size_t i = 0; i < currentSize; ++i) {
      auto value = getElement(i);
      result = dg(value);
      setElement(i, value);
    }
    return result;
  }

  int opApply(int delegate(ref size_t index, ref om_data value) dg) {
    int result;

    size_t currentSize = size();
    for (size_t i = 0; i < currentSize; ++i) {
      auto value = getElement(i);

      // Workaround for http://d.puremagic.com/issues/show_bug.cgi?id=2443.
      auto index = i;

      result = dg(index, value);
      setElement(i, value);
    }
    return result;
  }

  public bool empty() const {
    bool ret = omscript_im.om_list_data_empty(cast(void*)swigCPtr) ? true : false;
    return ret;
  }

  public void clear() {
    omscript_im.om_list_data_clear(cast(void*)swigCPtr);
  }

  public void push_back(om_data x) {
    omscript_im.om_list_data_push_back(cast(void*)swigCPtr, om_data.swigGetCPtr(x));
    if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
  }

  public void pop_back() {
    omscript_im.om_list_data_pop_back(cast(void*)swigCPtr);
  }

  public size_t size() const {
    auto ret = omscript_im.om_list_data_size(cast(void*)swigCPtr);
    return ret;
  }

  public size_t capacity() const {
    auto ret = omscript_im.om_list_data_capacity(cast(void*)swigCPtr);
    return ret;
  }

  public void reserve(size_t n) {
    omscript_im.om_list_data_reserve(cast(void*)swigCPtr, n);
    if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
  }

  public this() {
    this(omscript_im.new_om_list_data__SWIG_0(), true);
  }

  public this(om_list_data other) {
    this(omscript_im.new_om_list_data__SWIG_1(om_list_data.swigGetCPtr(other)), true);
    if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
  }

  public this(size_t capacity) {
    this(omscript_im.new_om_list_data__SWIG_2(capacity), true);
    if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
  }

  public om_data remove() {
    om_data ret = new om_data(omscript_im.om_list_data_remove__SWIG_0(cast(void*)swigCPtr), false);
    if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
    return ret;
  }

  public om_data remove(size_t index) {
    om_data ret = new om_data(omscript_im.om_list_data_remove__SWIG_1(cast(void*)swigCPtr, index), false);
    if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
    return ret;
  }

  public void removeBack(size_t how_many) {
    omscript_im.om_list_data_removeBack(cast(void*)swigCPtr, how_many);
    if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
  }

  public void linearRemove(size_t start_index, size_t end_index) {
    omscript_im.om_list_data_linearRemove(cast(void*)swigCPtr, start_index, end_index);
    if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
  }

  public void insertAt(size_t index, om_data x) {
    omscript_im.om_list_data_insertAt(cast(void*)swigCPtr, index, om_data.swigGetCPtr(x));
    if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
  }

  public om_data getElement(size_t index) {
    om_data ret = new om_data(omscript_im.om_list_data_getElement(cast(void*)swigCPtr, index), false);
    if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
    return ret;
  }

  public void setElement(size_t index, om_data val) {
    omscript_im.om_list_data_setElement(cast(void*)swigCPtr, index, om_data.swigGetCPtr(val));
    if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
  }
}

class om_dict_data {
  private void* swigCPtr;
  protected bool swigCMemOwn;

  public this(void* cObject, bool ownCObject) {
    swigCPtr = cObject;
    swigCMemOwn = ownCObject;
  }

  public static void* swigGetCPtr(typeof(this) obj) {
    return (obj is null) ? null : obj.swigCPtr;
  }

  mixin omscript_im.SwigOperatorDefinitions;

  ~this() {
    dispose();
  }

  public void dispose() {
    synchronized(this) {
      if (swigCPtr !is null) {
        if (swigCMemOwn) {
          swigCMemOwn = false;
          omscript_im.delete_om_dict_data(cast(void*)swigCPtr);
        }
        swigCPtr = null;
      }
    }
  }

  public this() {
    this(omscript_im.new_om_dict_data__SWIG_0(), true);
  }

  public this(om_dict_data other) {
    this(omscript_im.new_om_dict_data__SWIG_1(om_dict_data.swigGetCPtr(other)), true);
    if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
  }

  public uint size() const {
    auto ret = omscript_im.om_dict_data_size(cast(void*)swigCPtr);
    return ret;
  }

  public bool empty() const {
    bool ret = omscript_im.om_dict_data_empty(cast(void*)swigCPtr) ? true : false;
    return ret;
  }

  public void clear() {
    omscript_im.om_dict_data_clear(cast(void*)swigCPtr);
  }

  public om_data get(string key) {
    om_data ret = new om_data(omscript_im.om_dict_data_get(cast(void*)swigCPtr, (key ? std.string.toStringz(key) : null)), false);
    if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
    return ret;
  }

  public void set(string key, om_data x) {
    omscript_im.om_dict_data_set(cast(void*)swigCPtr, (key ? std.string.toStringz(key) : null), om_data.swigGetCPtr(x));
    if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
  }

  public void del(string key) {
    omscript_im.om_dict_data_del(cast(void*)swigCPtr, (key ? std.string.toStringz(key) : null));
    if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
  }

  public bool has_key(string key) {
    bool ret = omscript_im.om_dict_data_has_key(cast(void*)swigCPtr, (key ? std.string.toStringz(key) : null)) ? true : false;
    if (omscript_im.SwigPendingException.isPending) throw omscript_im.SwigPendingException.retrieve();
    return ret;
  }
}

class SWIGTYPE_p_std__functionT_std__shared_ptrT_om_register_t_fom_list_dataF_t {
  private void* swigCPtr;

  public this(void* cObject, bool futureUse) {
    swigCPtr = cObject;
  }

  protected this() {
    swigCPtr = null;
  }

  public static void* swigGetCPtr(typeof(this) obj) {
    return (obj is null) ? null : obj.swigCPtr;
  }

  mixin omscript_im.SwigOperatorDefinitions;
}

class SWIGTYPE_p_f_om_list_data__std__shared_ptrT_om_register_t {
  private void* swigCPtr;

  public this(void* cObject, bool futureUse) {
    swigCPtr = cObject;
  }

  protected this() {
    swigCPtr = null;
  }

  public static void* swigGetCPtr(typeof(this) obj) {
    return (obj is null) ? null : obj.swigCPtr;
  }

  mixin omscript_im.SwigOperatorDefinitions;
}
