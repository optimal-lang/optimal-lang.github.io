import std.stdio;
import omscript;

void main()
{
	print(new_bool(true));
	om_register_ptr_vector vect = new om_register_ptr_vector();
	vect.push_back(new_bool(true));
	vect.push_back(new_bool(false));
	//om_register_ptr list = new_list([new_bool(true), new_bool(false)]);
	print(new_list(vect));
}
