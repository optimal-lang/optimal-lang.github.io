import std.stdio;
import omscript;

void main()
{
	print(new_bool(true));
	print(new_string("abc"));
	print(new_number(1.23));
	om_register_ptr_vector vect = new om_register_ptr_vector();
	vect.push_back(new_bool(true));
	vect.push_back(new_bool(false));
	vect.push_back(new_string("abc"));
	vect.push_back(new_number(1.23));
	print(new_list(vect));
}
