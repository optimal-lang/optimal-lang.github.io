import std.stdio;
import omscript;

class X {
	int x(int a, int b) { return 0; }
}

void main()
{
	auto obj = new class om_callback
	{
		public override om_data run(om_list_data __arguments__) {
			om_data a = get_arg(__arguments__, 0);
			om_data b = get_arg(__arguments__, 1);
			return new_number( number_value(a)+number_value(b) );
		}
	};
	om_list_data args = new om_list_data();
	args.push_back(new_number(11));
	args.push_back(new_number(22));
	print(new_list(args));
	print(obj.run(args));
	om_data add2 = new_func(obj);
	print(call(add2, args));
	/*
	*/
	print(new_bool(true));
	print(new_string("abc"));
	print(new_number(1.23));
	om_data list1 = ((om_list_data __result__ = new om_list_data()) {
		__result__.push_back(new_bool(true));
		__result__.push_back(new_bool(false));
		__result__.push_back(new_string("abc"));
		__result__.push_back(new_number(1.23));
		return new_list(__result__);
	}());
	print(list1);
	om_list_data vect = new om_list_data();
	vect.push_back(new_bool(true));
	vect.push_back(new_bool(false));
	vect.push_back(new_string("abc"));
	vect.push_back(new_number(1.23));
	print(new_list(vect));
	om_dict_data dict = new om_dict_data();
	dict.set("abc", new_number(777));
	print(new_dict(dict));
	print(new_list(vect, dict));
}
