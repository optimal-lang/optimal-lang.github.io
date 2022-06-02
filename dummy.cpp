#include <iostream>
#include <vector>

int main()
{
    std::vector<double> v;
    v.resize(3);
    v[2] = 123;
    for (std::size_t i = 0; i < v.size(); i++)
    {
        std::cerr << i << ":" << v[i] << std::endl;
    }
    return 0;
}