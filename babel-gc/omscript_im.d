/* ----------------------------------------------------------------------------
 * This file was automatically generated by SWIG (http://www.swig.org).
 * Version 4.0.2
 *
 * Do not make changes to this file unless you know what you are doing--modify
 * the SWIG interface file instead.
 * ----------------------------------------------------------------------------- */

module omscript_im;
static import core.stdc.config;

static import std.conv;

static import std.conv;
static import std.string;


private {
  version(linux) {
    version = Nix;
  } else version(darwin) {
    version = Nix;
  } else version(OSX) {
    version = Nix;
  } else version(FreeBSD) {
    version = Nix;
    version = freebsd;
  } else version(freebsd) {
    version = Nix;
  } else version(Unix) {
    version = Nix;
  } else version(Posix) {
    version = Nix;
  }

  version(Tango) {
    static import tango.stdc.string;
    static import tango.stdc.stringz;

    version (PhobosCompatibility) {
    } else {
      alias char[] string;
      alias wchar[] wstring;
      alias dchar[] dstring;
    }
  } else {
    version(D_Version2) {
      static import std.conv;
    } else {
      static import std.c.string;
    }
    static import std.string;
  }

  version(D_Version2) {
    mixin("alias const(char)* CCPTR;");
  } else {
    alias char* CCPTR;
  }

  CCPTR swigToCString(string str) {
    version(Tango) {
      return tango.stdc.stringz.toStringz(str);
    } else {
      return std.string.toStringz(str);
    }
  }

  string swigToDString(CCPTR cstr) {
    version(Tango) {
      return tango.stdc.stringz.fromStringz(cstr);
    } else {
      version(D_Version2) {
        mixin("return std.conv.to!string(cstr);");
      } else {
        return std.c.string.toString(cstr);
      }
    }
  }
}

class SwigSwigSharedLibLoadException : Exception {
  this(in string[] libNames, in string[] reasons) {
    string msg = "Failed to load one or more shared libraries:";
    foreach(i, n; libNames) {
      msg ~= "\n\t" ~ n ~ " - ";
      if(i < reasons.length)
        msg ~= reasons[i];
      else
        msg ~= "Unknown";
    }
    super(msg);
  }
}

class SwigSymbolLoadException : Exception {
  this(string SwigSharedLibName, string symbolName) {
    super("Failed to load symbol " ~ symbolName ~ " from shared library " ~ SwigSharedLibName);
    _symbolName = symbolName;
  }

  string symbolName() {
    return _symbolName;
  }

private:
  string _symbolName;
}

private {
  version(Nix) {
    version(freebsd) {
      // the dl* functions are in libc on FreeBSD
    }
    else {
      pragma(lib, "dl");
    }

    version(Tango) {
      import tango.sys.Common;
    } else version(linux) {
      import core.sys.posix.dlfcn;
    } else {
      extern(C) {
        const RTLD_NOW = 2;

        void *dlopen(CCPTR file, int mode);
        int dlclose(void* handle);
        void *dlsym(void* handle, CCPTR name);
        CCPTR dlerror();
      }
    }

    alias void* SwigSharedLibHandle;

    SwigSharedLibHandle swigLoadSharedLib(string libName) {
      return dlopen(swigToCString(libName), RTLD_NOW);
    }

    void swigUnloadSharedLib(SwigSharedLibHandle hlib) {
      dlclose(hlib);
    }

    void* swigGetSymbol(SwigSharedLibHandle hlib, string symbolName) {
      return dlsym(hlib, swigToCString(symbolName));
    }

    string swigGetErrorStr() {
      CCPTR err = dlerror();
      if (err is null) {
        return "Unknown Error";
      }
      return swigToDString(err);
    }
  } else version(Windows) {
    alias ushort WORD;
    alias uint DWORD;
    alias CCPTR LPCSTR;
    alias void* HMODULE;
    alias void* HLOCAL;
    alias int function() FARPROC;
    struct VA_LIST {}

    extern (Windows) {
      HMODULE LoadLibraryA(LPCSTR);
      FARPROC GetProcAddress(HMODULE, LPCSTR);
      void FreeLibrary(HMODULE);
      DWORD GetLastError();
      DWORD FormatMessageA(DWORD, in void*, DWORD, DWORD, LPCSTR, DWORD, VA_LIST*);
      HLOCAL LocalFree(HLOCAL);
    }

    DWORD MAKELANGID(WORD p, WORD s) {
      return (((cast(WORD)s) << 10) | cast(WORD)p);
    }

    enum {
      LANG_NEUTRAL                    = 0,
      SUBLANG_DEFAULT                 = 1,
      FORMAT_MESSAGE_ALLOCATE_BUFFER  = 256,
      FORMAT_MESSAGE_IGNORE_INSERTS   = 512,
      FORMAT_MESSAGE_FROM_SYSTEM      = 4096
    }

    alias HMODULE SwigSharedLibHandle;

    SwigSharedLibHandle swigLoadSharedLib(string libName) {
      return LoadLibraryA(swigToCString(libName));
    }

    void swigUnloadSharedLib(SwigSharedLibHandle hlib) {
      FreeLibrary(hlib);
    }

    void* swigGetSymbol(SwigSharedLibHandle hlib, string symbolName) {
      return GetProcAddress(hlib, swigToCString(symbolName));
    }

    string swigGetErrorStr() {
      DWORD errcode = GetLastError();

      LPCSTR msgBuf;
      DWORD i = FormatMessageA(
        FORMAT_MESSAGE_ALLOCATE_BUFFER |
        FORMAT_MESSAGE_FROM_SYSTEM |
        FORMAT_MESSAGE_IGNORE_INSERTS,
        null,
        errcode,
        MAKELANGID(LANG_NEUTRAL, SUBLANG_DEFAULT),
        cast(LPCSTR)&msgBuf,
        0,
        null);

      string text = swigToDString(msgBuf);
      LocalFree(cast(HLOCAL)msgBuf);

      if (i >= 2) {
        i -= 2;
      }
      return text[0 .. i];
    }
  } else {
    static assert(0, "Operating system not supported by the wrapper loading code.");
  }

  final class SwigSharedLib {
    void load(string[] names) {
      if (_hlib !is null) return;

      string[] failedLibs;
      string[] reasons;

      foreach(n; names) {
        _hlib = swigLoadSharedLib(n);
        if (_hlib is null) {
          failedLibs ~= n;
          reasons ~= swigGetErrorStr();
          continue;
        }
        _name = n;
        break;
      }

      if (_hlib is null) {
        throw new SwigSwigSharedLibLoadException(failedLibs, reasons);
      }
    }

    void* loadSymbol(string symbolName, bool doThrow = true) {
      void* sym = swigGetSymbol(_hlib, symbolName);
      if(doThrow && (sym is null)) {
        throw new SwigSymbolLoadException(_name, symbolName);
      }
      return sym;
    }

    void unload() {
      if(_hlib !is null) {
        swigUnloadSharedLib(_hlib);
        _hlib = null;
      }
    }

  private:
    string _name;
    SwigSharedLibHandle _hlib;
  }
}

static this() {
  string[] possibleFileNames;
  version (Posix) {
    version (OSX) {
      possibleFileNames ~= ["libomscript_wrap.dylib", "libomscript_wrap.bundle"];
    }
    possibleFileNames ~= ["libomscript_wrap.so"];
  } else version (Windows) {
    possibleFileNames ~= ["omscript_wrap.dll", "libomscript_wrap.so"];
  } else {
    static assert(false, "Operating system not supported by the wrapper loading code.");
  }

  auto library = new SwigSharedLib;
  library.load(possibleFileNames);

  string bindCode(string functionPointer, string symbol) {
    return functionPointer ~ " = cast(typeof(" ~ functionPointer ~
      "))library.loadSymbol(`" ~ symbol ~ "`);";
  }

  //#if !defined(SWIG_D_NO_EXCEPTION_HELPER)
  mixin(bindCode("swigRegisterExceptionCallbacksomscript", "SWIGRegisterExceptionCallbacks_omscript"));
  //#endif // SWIG_D_NO_EXCEPTION_HELPER
  //#if !defined(SWIG_D_NO_STRING_HELPER)
  mixin(bindCode("swigRegisterStringCallbackomscript", "SWIGRegisterStringCallback_omscript"));
  //#endif // SWIG_D_NO_STRING_HELPER
  
  mixin(bindCode("new_om_data", "D_new_om_data"));
  mixin(bindCode("delete_om_data", "D_delete_om_data"));
  mixin(bindCode("delete_om_callback", "D_delete_om_callback"));
  mixin(bindCode("om_callback_run", "D_om_callback_run"));
  mixin(bindCode("om_callback_runSwigExplicitom_callback", "D_om_callback_runSwigExplicitom_callback"));
  mixin(bindCode("new_om_callback", "D_new_om_callback"));
  mixin(bindCode("om_callback_director_connect", "D_om_callback_director_connect"));
  mixin(bindCode("om_register_type_of", "D_om_register_type_of"));
  mixin(bindCode("om_register_printable_text", "D_om_register_printable_text"));
  mixin(bindCode("om_register_bool_value", "D_om_register_bool_value"));
  mixin(bindCode("om_register_number_value", "D_om_register_number_value"));
  mixin(bindCode("om_register_string_value", "D_om_register_string_value"));
  mixin(bindCode("om_register_push", "D_om_register_push"));
  mixin(bindCode("om_register_opIndex", "D_om_register_opIndex"));
  mixin(bindCode("new_om_register", "D_new_om_register"));
  mixin(bindCode("delete_om_register", "D_delete_om_register"));
  mixin(bindCode("new_om_undefined", "D_new_om_undefined"));
  mixin(bindCode("om_undefined_type_of", "D_om_undefined_type_of"));
  mixin(bindCode("om_undefined_printable_text", "D_om_undefined_printable_text"));
  mixin(bindCode("om_undefined_string_value", "D_om_undefined_string_value"));
  mixin(bindCode("delete_om_undefined", "D_delete_om_undefined"));
  mixin(bindCode("om_undefined_Upcast", "D_om_undefined_Upcast"));
  mixin(bindCode("new_om_null", "D_new_om_null"));
  mixin(bindCode("om_null_type_of", "D_om_null_type_of"));
  mixin(bindCode("om_null_printable_text", "D_om_null_printable_text"));
  mixin(bindCode("om_null_string_value", "D_om_null_string_value"));
  mixin(bindCode("delete_om_null", "D_delete_om_null"));
  mixin(bindCode("om_null_Upcast", "D_om_null_Upcast"));
  mixin(bindCode("bool_value__SWIG_0", "D_bool_value__SWIG_0"));
  mixin(bindCode("bool_value__SWIG_1", "D_bool_value__SWIG_1"));
  mixin(bindCode("bool_value__SWIG_2", "D_bool_value__SWIG_2"));
  mixin(bindCode("number_value__SWIG_0", "D_number_value__SWIG_0"));
  mixin(bindCode("number_value__SWIG_1", "D_number_value__SWIG_1"));
  mixin(bindCode("string_value__SWIG_0", "D_string_value__SWIG_0"));
  mixin(bindCode("string_value__SWIG_1", "D_string_value__SWIG_1"));
  mixin(bindCode("printable_text", "D_printable_text"));
  mixin(bindCode("stringify_sting", "D_stringify_sting"));
  mixin(bindCode("new_om_bool", "D_new_om_bool"));
  mixin(bindCode("om_bool_type_of", "D_om_bool_type_of"));
  mixin(bindCode("om_bool_printable_text", "D_om_bool_printable_text"));
  mixin(bindCode("om_bool_string_value", "D_om_bool_string_value"));
  mixin(bindCode("om_bool_bool_value", "D_om_bool_bool_value"));
  mixin(bindCode("om_bool_number_value", "D_om_bool_number_value"));
  mixin(bindCode("delete_om_bool", "D_delete_om_bool"));
  mixin(bindCode("om_bool_Upcast", "D_om_bool_Upcast"));
  mixin(bindCode("new_om_number", "D_new_om_number"));
  mixin(bindCode("om_number_type_of", "D_om_number_type_of"));
  mixin(bindCode("om_number_printable_text", "D_om_number_printable_text"));
  mixin(bindCode("om_number_number_value", "D_om_number_number_value"));
  mixin(bindCode("om_number_string_value", "D_om_number_string_value"));
  mixin(bindCode("om_number_bool_value", "D_om_number_bool_value"));
  mixin(bindCode("delete_om_number", "D_delete_om_number"));
  mixin(bindCode("om_number_Upcast", "D_om_number_Upcast"));
  mixin(bindCode("new_om_string", "D_new_om_string"));
  mixin(bindCode("om_string_type_of", "D_om_string_type_of"));
  mixin(bindCode("om_string_printable_text", "D_om_string_printable_text"));
  mixin(bindCode("om_string_string_value", "D_om_string_string_value"));
  mixin(bindCode("om_string_bool_value", "D_om_string_bool_value"));
  mixin(bindCode("delete_om_string", "D_delete_om_string"));
  mixin(bindCode("om_string_Upcast", "D_om_string_Upcast"));
  mixin(bindCode("new_om_list__SWIG_0", "D_new_om_list__SWIG_0"));
  mixin(bindCode("new_om_list__SWIG_1", "D_new_om_list__SWIG_1"));
  mixin(bindCode("new_om_list__SWIG_2", "D_new_om_list__SWIG_2"));
  mixin(bindCode("om_list_type_of", "D_om_list_type_of"));
  mixin(bindCode("om_list_printable_text", "D_om_list_printable_text"));
  mixin(bindCode("om_list_string_value", "D_om_list_string_value"));
  mixin(bindCode("om_list_bool_value", "D_om_list_bool_value"));
  mixin(bindCode("om_list_push", "D_om_list_push"));
  mixin(bindCode("om_list_opIndex", "D_om_list_opIndex"));
  mixin(bindCode("delete_om_list", "D_delete_om_list"));
  mixin(bindCode("om_list_Upcast", "D_om_list_Upcast"));
  mixin(bindCode("new_om_dict__SWIG_0", "D_new_om_dict__SWIG_0"));
  mixin(bindCode("new_om_dict__SWIG_1", "D_new_om_dict__SWIG_1"));
  mixin(bindCode("om_dict_type_of", "D_om_dict_type_of"));
  mixin(bindCode("om_dict_printable_text", "D_om_dict_printable_text"));
  mixin(bindCode("om_dict_string_value", "D_om_dict_string_value"));
  mixin(bindCode("om_dict_bool_value", "D_om_dict_bool_value"));
  mixin(bindCode("delete_om_dict", "D_delete_om_dict"));
  mixin(bindCode("om_dict_Upcast", "D_om_dict_Upcast"));
  mixin(bindCode("new_om_func", "D_new_om_func"));
  mixin(bindCode("om_func_type_of", "D_om_func_type_of"));
  mixin(bindCode("om_func_printable_text", "D_om_func_printable_text"));
  mixin(bindCode("om_func_string_value", "D_om_func_string_value"));
  mixin(bindCode("om_func_bool_value", "D_om_func_bool_value"));
  mixin(bindCode("om_func_opCall", "D_om_func_opCall"));
  mixin(bindCode("delete_om_func", "D_delete_om_func"));
  mixin(bindCode("om_func_Upcast", "D_om_func_Upcast"));
  mixin(bindCode("new_undefined", "D_new_undefined"));
  mixin(bindCode("new_null", "D_new_null"));
  mixin(bindCode("new_bool", "D_new_bool"));
  mixin(bindCode("new_number", "D_new_number"));
  mixin(bindCode("new_string", "D_new_string"));
  mixin(bindCode("new_list__SWIG_0", "D_new_list__SWIG_0"));
  mixin(bindCode("new_list__SWIG_1", "D_new_list__SWIG_1"));
  mixin(bindCode("new_list__SWIG_2", "D_new_list__SWIG_2"));
  mixin(bindCode("new_dict", "D_new_dict"));
  mixin(bindCode("new_func", "D_new_func"));
  mixin(bindCode("__get_arg__", "D___get_arg__"));
  mixin(bindCode("__print__", "D___print__"));
  mixin(bindCode("__eq__", "D___eq__"));
  mixin(bindCode("__equal__", "D___equal__"));
  mixin(bindCode("__call__", "D___call__"));
  mixin(bindCode("__op_add__", "D___op_add__"));
  mixin(bindCode("om_list_data_empty", "D_om_list_data_empty"));
  mixin(bindCode("om_list_data_clear", "D_om_list_data_clear"));
  mixin(bindCode("om_list_data_push_back", "D_om_list_data_push_back"));
  mixin(bindCode("om_list_data_pop_back", "D_om_list_data_pop_back"));
  mixin(bindCode("om_list_data_size", "D_om_list_data_size"));
  mixin(bindCode("om_list_data_capacity", "D_om_list_data_capacity"));
  mixin(bindCode("om_list_data_reserve", "D_om_list_data_reserve"));
  mixin(bindCode("new_om_list_data__SWIG_0", "D_new_om_list_data__SWIG_0"));
  mixin(bindCode("new_om_list_data__SWIG_1", "D_new_om_list_data__SWIG_1"));
  mixin(bindCode("new_om_list_data__SWIG_2", "D_new_om_list_data__SWIG_2"));
  mixin(bindCode("om_list_data_remove__SWIG_0", "D_om_list_data_remove__SWIG_0"));
  mixin(bindCode("om_list_data_remove__SWIG_1", "D_om_list_data_remove__SWIG_1"));
  mixin(bindCode("om_list_data_removeBack", "D_om_list_data_removeBack"));
  mixin(bindCode("om_list_data_linearRemove", "D_om_list_data_linearRemove"));
  mixin(bindCode("om_list_data_insertAt", "D_om_list_data_insertAt"));
  mixin(bindCode("om_list_data_getElement", "D_om_list_data_getElement"));
  mixin(bindCode("om_list_data_setElement", "D_om_list_data_setElement"));
  mixin(bindCode("delete_om_list_data", "D_delete_om_list_data"));
  mixin(bindCode("new_om_dict_data__SWIG_0", "D_new_om_dict_data__SWIG_0"));
  mixin(bindCode("new_om_dict_data__SWIG_1", "D_new_om_dict_data__SWIG_1"));
  mixin(bindCode("om_dict_data_size", "D_om_dict_data_size"));
  mixin(bindCode("om_dict_data_empty", "D_om_dict_data_empty"));
  mixin(bindCode("om_dict_data_clear", "D_om_dict_data_clear"));
  mixin(bindCode("om_dict_data_get", "D_om_dict_data_get"));
  mixin(bindCode("om_dict_data_set", "D_om_dict_data_set"));
  mixin(bindCode("om_dict_data_del", "D_om_dict_data_del"));
  mixin(bindCode("om_dict_data_has_key", "D_om_dict_data_has_key"));
  mixin(bindCode("delete_om_dict_data", "D_delete_om_dict_data"));
}

//#if !defined(SWIG_D_NO_EXCEPTION_HELPER)
extern(C) void function(
  SwigExceptionCallback exceptionCallback,
  SwigExceptionCallback illegalArgumentCallback,
  SwigExceptionCallback illegalElementCallback,
  SwigExceptionCallback ioCallback,
  SwigExceptionCallback noSuchElementCallback) swigRegisterExceptionCallbacksomscript;
//#endif // SWIG_D_NO_EXCEPTION_HELPER

//#if !defined(SWIG_D_NO_STRING_HELPER)
extern(C) void function(SwigStringCallback callback) swigRegisterStringCallbackomscript;
//#endif // SWIG_D_NO_STRING_HELPER


mixin template SwigOperatorDefinitions() {
  public override bool opEquals(Object o) {
    if (auto rhs = cast(typeof(this))o) {
      if (swigCPtr == rhs.swigCPtr) return true;
      static if (is(typeof(swigOpEquals(rhs)))) {
        return swigOpEquals(rhs);
      } else {
        return false; 
      }
    }
    return super.opEquals(o);
  }

  
  public override int opCmp(Object o) {
    static if (__traits(compiles, swigOpLt(typeof(this).init) &&
        swigOpEquals(typeof(this).init))) {
      if (auto rhs = cast(typeof(this))o) {
        if (swigOpLt(rhs)) {
          return -1;
        } else if (swigOpEquals(rhs)) {
          return 0;
        } else {
          return 1;
        }
      }
    }
    return super.opCmp(o);
  }

  private template swigOpBinary(string operator, string name) {
    enum swigOpBinary = `public void opOpAssign(string op, T)(T rhs) if (op == "` ~ operator ~
      `" && __traits(compiles, swigOp` ~ name ~ `Assign(rhs))) { swigOp` ~ name ~ `Assign(rhs);}` ~
      `public auto opBinary(string op, T)(T rhs) if (op == "` ~ operator ~
      `" && __traits(compiles, swigOp` ~ name ~ `(rhs))) { return swigOp` ~ name ~ `(rhs);}`;
  }
  mixin(swigOpBinary!("+", "Add"));
  mixin(swigOpBinary!("-", "Sub"));
  mixin(swigOpBinary!("*", "Mul"));
  mixin(swigOpBinary!("/", "Div"));
  mixin(swigOpBinary!("%", "Mod"));
  mixin(swigOpBinary!("&", "And"));
  mixin(swigOpBinary!("|", "Or"));
  mixin(swigOpBinary!("^", "Xor"));
  mixin(swigOpBinary!("<<", "Shl"));
  mixin(swigOpBinary!(">>", "Shr"));
  
  private template swigOpUnary(string operator, string name) {
    enum swigOpUnary = `public auto opUnary(string op)() if (op == "` ~ operator ~
      `" && __traits(compiles, swigOp` ~ name ~ `())) { return swigOp` ~ name ~ `();}`;   
  }
  mixin(swigOpUnary!("+", "Pos"));
  mixin(swigOpUnary!("-", "Neg"));
  mixin(swigOpUnary!("~", "Com"));
  mixin(swigOpUnary!("++", "Inc"));
  mixin(swigOpUnary!("--", "Dec"));


}


private class SwigExceptionHelper {
  static this() {
	// The D1/Tango version maps C++ exceptions to multiple exception types.
    swigRegisterExceptionCallbacksomscript(
      &setException,
      &setException,
      &setException,
      &setException,
      &setException
    );
  }

  static void setException(const char* message) {
    auto exception = new object.Exception(std.conv.to!string(message));
    SwigPendingException.set(exception);
  }
}

struct SwigPendingException {
public:
  static this() {
    m_sPendingException = null;
  }

  static bool isPending() {
    return m_sPendingException !is null;
  }

  static void set(object.Exception e) {
    if (m_sPendingException !is null) {
      e.next = m_sPendingException;
      throw new object.Exception("FATAL: An earlier pending exception from C/C++ code " ~
        "was missed and thus not thrown (" ~ m_sPendingException.classinfo.name ~
        ": " ~ m_sPendingException.msg ~ ")!", e);
    }

    m_sPendingException = e;
  }

  static object.Exception retrieve() {
    auto e = m_sPendingException;
    m_sPendingException = null;
    return e;
  }

private:
  // The reference to the pending exception (if any) is stored thread-local.
  static object.Exception m_sPendingException;
}
alias void function(const char* message) SwigExceptionCallback;


private class SwigStringHelper {
  static this() {
    swigRegisterStringCallbackomscript(&createString);
  }

  static const(char)* createString(const(char*) cString) {
    // We are effectively dup'ing the string here.
    // TODO: Is this also correct for D2/Phobos?
    return std.string.toStringz(std.conv.to!string(cString));
  }
}
alias const(char)* function(const(char*) cString) SwigStringCallback;


template SwigExternC(T) if (is(typeof(*(T.init)) P == function)) {
  static if (is(typeof(*(T.init)) R == return)) {
    static if (is(typeof(*(T.init)) P == function)) {
      alias extern(C) R function(P) SwigExternC;
    }
  }
}

SwigExternC!(void* function()) new_om_data;
SwigExternC!(void function(void* jarg1)) delete_om_data;
alias extern(C) void* function(void*, void* arg0) SwigDirector_om_callback_Callback0;
SwigExternC!(void function(void* jarg1)) delete_om_callback;
SwigExternC!(void* function(void* jarg1, void* jarg2)) om_callback_run;
SwigExternC!(void* function(void* jarg1, void* jarg2)) om_callback_runSwigExplicitom_callback;
SwigExternC!(void* function()) new_om_callback;
extern(C) void function(void* cObject, void* dObject, SwigDirector_om_callback_Callback0 callback0) om_callback_director_connect;
SwigExternC!(int function(void* jarg1)) om_register_type_of;
SwigExternC!(const(char)* function(void* jarg1)) om_register_printable_text;
SwigExternC!(uint function(void* jarg1)) om_register_bool_value;
SwigExternC!(double function(void* jarg1)) om_register_number_value;
SwigExternC!(const(char)* function(void* jarg1)) om_register_string_value;
SwigExternC!(void function(void* jarg1, void* jarg2)) om_register_push;
SwigExternC!(void* function(void* jarg1, void* jarg2)) om_register_opIndex;
SwigExternC!(void* function()) new_om_register;
SwigExternC!(void function(void* jarg1)) delete_om_register;
SwigExternC!(void* function()) new_om_undefined;
SwigExternC!(int function(void* jarg1)) om_undefined_type_of;
SwigExternC!(const(char)* function(void* jarg1)) om_undefined_printable_text;
SwigExternC!(const(char)* function(void* jarg1)) om_undefined_string_value;
SwigExternC!(void function(void* jarg1)) delete_om_undefined;
SwigExternC!(void* function(void* objectRef)) om_undefined_Upcast;
SwigExternC!(void* function()) new_om_null;
SwigExternC!(int function(void* jarg1)) om_null_type_of;
SwigExternC!(const(char)* function(void* jarg1)) om_null_printable_text;
SwigExternC!(const(char)* function(void* jarg1)) om_null_string_value;
SwigExternC!(void function(void* jarg1)) delete_om_null;
SwigExternC!(void* function(void* objectRef)) om_null_Upcast;
SwigExternC!(uint function(uint jarg1)) bool_value__SWIG_0;
SwigExternC!(uint function(void* jarg1)) bool_value__SWIG_1;
SwigExternC!(uint function(void* jarg1)) bool_value__SWIG_2;
SwigExternC!(double function(void* jarg1)) number_value__SWIG_0;
SwigExternC!(double function(void* jarg1)) number_value__SWIG_1;
SwigExternC!(const(char)* function(void* jarg1)) string_value__SWIG_0;
SwigExternC!(const(char)* function(void* jarg1)) string_value__SWIG_1;
SwigExternC!(const(char)* function(void* jarg1)) printable_text;
SwigExternC!(const(char)* function(const(char)* jarg1)) stringify_sting;
SwigExternC!(void* function(uint jarg1)) new_om_bool;
SwigExternC!(int function(void* jarg1)) om_bool_type_of;
SwigExternC!(const(char)* function(void* jarg1)) om_bool_printable_text;
SwigExternC!(const(char)* function(void* jarg1)) om_bool_string_value;
SwigExternC!(uint function(void* jarg1)) om_bool_bool_value;
SwigExternC!(double function(void* jarg1)) om_bool_number_value;
SwigExternC!(void function(void* jarg1)) delete_om_bool;
SwigExternC!(void* function(void* objectRef)) om_bool_Upcast;
SwigExternC!(void* function(double jarg1)) new_om_number;
SwigExternC!(int function(void* jarg1)) om_number_type_of;
SwigExternC!(const(char)* function(void* jarg1)) om_number_printable_text;
SwigExternC!(double function(void* jarg1)) om_number_number_value;
SwigExternC!(const(char)* function(void* jarg1)) om_number_string_value;
SwigExternC!(uint function(void* jarg1)) om_number_bool_value;
SwigExternC!(void function(void* jarg1)) delete_om_number;
SwigExternC!(void* function(void* objectRef)) om_number_Upcast;
SwigExternC!(void* function(const(char)* jarg1)) new_om_string;
SwigExternC!(int function(void* jarg1)) om_string_type_of;
SwigExternC!(const(char)* function(void* jarg1)) om_string_printable_text;
SwigExternC!(const(char)* function(void* jarg1)) om_string_string_value;
SwigExternC!(uint function(void* jarg1)) om_string_bool_value;
SwigExternC!(void function(void* jarg1)) delete_om_string;
SwigExternC!(void* function(void* objectRef)) om_string_Upcast;
SwigExternC!(void* function(void* jarg1, void* jarg2)) new_om_list__SWIG_0;
SwigExternC!(void* function(void* jarg1)) new_om_list__SWIG_1;
SwigExternC!(void* function()) new_om_list__SWIG_2;
SwigExternC!(int function(void* jarg1)) om_list_type_of;
SwigExternC!(const(char)* function(void* jarg1)) om_list_printable_text;
SwigExternC!(const(char)* function(void* jarg1)) om_list_string_value;
SwigExternC!(uint function(void* jarg1)) om_list_bool_value;
SwigExternC!(void function(void* jarg1, void* jarg2)) om_list_push;
SwigExternC!(void* function(void* jarg1, void* jarg2)) om_list_opIndex;
SwigExternC!(void function(void* jarg1)) delete_om_list;
SwigExternC!(void* function(void* objectRef)) om_list_Upcast;
SwigExternC!(void* function(void* jarg1)) new_om_dict__SWIG_0;
SwigExternC!(void* function()) new_om_dict__SWIG_1;
SwigExternC!(int function(void* jarg1)) om_dict_type_of;
SwigExternC!(const(char)* function(void* jarg1)) om_dict_printable_text;
SwigExternC!(const(char)* function(void* jarg1)) om_dict_string_value;
SwigExternC!(uint function(void* jarg1)) om_dict_bool_value;
SwigExternC!(void function(void* jarg1)) delete_om_dict;
SwigExternC!(void* function(void* objectRef)) om_dict_Upcast;
SwigExternC!(void* function(void* jarg1)) new_om_func;
SwigExternC!(int function(void* jarg1)) om_func_type_of;
SwigExternC!(const(char)* function(void* jarg1)) om_func_printable_text;
SwigExternC!(const(char)* function(void* jarg1)) om_func_string_value;
SwigExternC!(uint function(void* jarg1)) om_func_bool_value;
SwigExternC!(void* function(void* jarg1, void* jarg2, void* jarg3)) om_func_opCall;
SwigExternC!(void function(void* jarg1)) delete_om_func;
SwigExternC!(void* function(void* objectRef)) om_func_Upcast;
SwigExternC!(void* function()) new_undefined;
SwigExternC!(void* function()) new_null;
SwigExternC!(void* function(uint jarg1)) new_bool;
SwigExternC!(void* function(double jarg1)) new_number;
SwigExternC!(void* function(const(char)* jarg1)) new_string;
SwigExternC!(void* function(void* jarg1, void* jarg2)) new_list__SWIG_0;
SwigExternC!(void* function(void* jarg1)) new_list__SWIG_1;
SwigExternC!(void* function()) new_list__SWIG_2;
SwigExternC!(void* function(void* jarg1)) new_dict;
SwigExternC!(void* function(void* jarg1)) new_func;
SwigExternC!(void* function(void* jarg1, long jarg2)) __get_arg__;
SwigExternC!(void* function(void* jarg1)) __print__;
SwigExternC!(void* function(void* jarg1, void* jarg2)) __eq__;
SwigExternC!(void* function(void* jarg1, void* jarg2)) __equal__;
SwigExternC!(void* function(void* jarg1, void* jarg2, void* jarg3)) __call__;
SwigExternC!(void* function(void* jarg1, void* jarg2)) __op_add__;
SwigExternC!(uint function(void* jarg1)) om_list_data_empty;
SwigExternC!(void function(void* jarg1)) om_list_data_clear;
SwigExternC!(void function(void* jarg1, void* jarg2)) om_list_data_push_back;
SwigExternC!(void function(void* jarg1)) om_list_data_pop_back;
SwigExternC!(size_t function(void* jarg1)) om_list_data_size;
SwigExternC!(size_t function(void* jarg1)) om_list_data_capacity;
SwigExternC!(void function(void* jarg1, size_t jarg2)) om_list_data_reserve;
SwigExternC!(void* function()) new_om_list_data__SWIG_0;
SwigExternC!(void* function(void* jarg1)) new_om_list_data__SWIG_1;
SwigExternC!(void* function(size_t jarg1)) new_om_list_data__SWIG_2;
SwigExternC!(void* function(void* jarg1)) om_list_data_remove__SWIG_0;
SwigExternC!(void* function(void* jarg1, size_t jarg2)) om_list_data_remove__SWIG_1;
SwigExternC!(void function(void* jarg1, size_t jarg2)) om_list_data_removeBack;
SwigExternC!(void function(void* jarg1, size_t jarg2, size_t jarg3)) om_list_data_linearRemove;
SwigExternC!(void function(void* jarg1, size_t jarg2, void* jarg3)) om_list_data_insertAt;
SwigExternC!(void* function(void* jarg1, size_t jarg2)) om_list_data_getElement;
SwigExternC!(void function(void* jarg1, size_t jarg2, void* jarg3)) om_list_data_setElement;
SwigExternC!(void function(void* jarg1)) delete_om_list_data;
SwigExternC!(void* function()) new_om_dict_data__SWIG_0;
SwigExternC!(void* function(void* jarg1)) new_om_dict_data__SWIG_1;
SwigExternC!(uint function(void* jarg1)) om_dict_data_size;
SwigExternC!(uint function(void* jarg1)) om_dict_data_empty;
SwigExternC!(void function(void* jarg1)) om_dict_data_clear;
SwigExternC!(void* function(void* jarg1, const(char)* jarg2)) om_dict_data_get;
SwigExternC!(void function(void* jarg1, const(char)* jarg2, void* jarg3)) om_dict_data_set;
SwigExternC!(void function(void* jarg1, const(char)* jarg2)) om_dict_data_del;
SwigExternC!(uint function(void* jarg1, const(char)* jarg2)) om_dict_data_has_key;
SwigExternC!(void function(void* jarg1)) delete_om_dict_data;
