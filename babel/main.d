import std.stdio;
import omscript;

void main()
{
    //test_long_double();
    om_data undefined = new_undefined();
    om_data c = new_number(10);
    auto obj = new class om_callback
    {
        public override om_data run(om_list_data __arguments__)
        {
            om_data a = get_arg(__arguments__, 0);
            om_data b = get_arg(__arguments__, 1);
            return new_number((number_value(a) + number_value(b)) * number_value(c));
        }
    };
    om_list_data args = new om_list_data();
    args.push_back(new_number(11));
    args.push_back(new_number(22));
    __print__(new_list(args));
    __print__(obj.run(args));
    c = new_number(20);
    om_data add2 = new_func(new class om_callback
        {
        public override om_data run(om_list_data __arguments__)
        {
            om_data a = get_arg(__arguments__, 0); om_data b = get_arg(__arguments__, 1);
                return new_number((number_value(a) + number_value(b)) * number_value(c));
        }
    }
);
    __print__(__call__(undefined, add2, args));
    __print__(new_bool(true));
    __print__(new_string("abc"));
    __print__(new_number(1.23));
    om_data list1 = ((om_list_data __result__ = new om_list_data()) {
        __result__.push_back(new_bool(true));
        __result__.push_back(new_bool(false));
        __result__.push_back(new_string("abc"));
        __result__.push_back(new_number(1.23));
        return new_list(__result__);
    }());
    __print__(list1);
    om_list_data vect = new om_list_data();
    vect.push_back(new_bool(true));
    vect.push_back(new_bool(false));
    vect.push_back(new_string("abc"));
    vect.push_back(new_number(1.23));
    __print__(new_list(vect));
    om_dict_data dict = new om_dict_data();
    dict.set("abc", new_number(777));
    __print__(new_dict(dict));
    __print__(new_list(vect, dict));
}
