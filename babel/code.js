function add2(a, b) {
  return a + b;
}
print(add2(11, 22));

let x = 123;
print(x);

let add3 = function(a, b, c) {
  return a + b + c;
}
print(add3(11, 22, 33));

function test01(a)
{
  let a10 = a + 10;
  print(a10);
  return 0;
}
print(test01(22));

let y = 1 + 2 + 3;
print(y);

print("abc");
print("abc"+123);
print("abc"+null);
print("abc"+undefined);
print([11, 22, 33]);
print({a:11, "b":22, c:33});

let list = [11, 22, 33];
let dict = {a:11, "b":22, c:33};
print(list+dict);
