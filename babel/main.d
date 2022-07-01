import std.stdio;
import omscript;

void main()
{
	print(new_bool(true));
	RegisterPtrVector list = new RegisterPtrVector();
	list.push_back(new_bool(true));
	list.push_back(new_bool(false));
	//om_register_ptr list = new_list([new_bool(true), new_bool(false)]);
	print(new_list(list));
}
