function add2(a, b) {
  return a + b;
}
print(add2(11, 22));

let x = 123;
print(x);

let add3 = function (a, b, c) {
  return a + b + c;
}
print(add3(11, 22, 33));

function test01(a) {
  let a10 = a + 10;
  print(a10);
  //return 0;
}
print(test01(22));

let y = 1 + 2 + 3;
print(y);

/*
print("abc");
print("abc" + 123);
print("abc" + null);
print("abc" + undefined);
print([11, 22, 33]);
print({ a: 11, "b": 22, c: 33 });

let list1 = [11, 22, 33];
let dict = { a: 11, "b": 22, c: 33 };
print(list1 + dict);
let list2 = [11, 22, 33, [44, 55]];
print(list2 + dict);
print(10 + true);
print(10 + "abc");
print(true + true);
print(null + undefined);
print(undefined + null);
print("abc" + null);
print(null + "abc");
print(null + 0);
//print("abc"+add2);
//print(add2+"abc");
print(add2);

let abc = 1;
print(`ABC+1: ${abc+1}`);
print(`test: ${add2(11, 22)+1}`);

let s = "AB";
switch (s+"C") {
  case "ABC":
    print("abc");
  case "XYZ": {
    print("xyz");
    break;
  }
  default: {
    print("default");
  }
}

s = "XYZ";
print(s);

list1 = [11, 22, 33];
dict = { a: 11, "b": 22, c: 33 };

print(list1[1]);
list1[1] = 222;
print(list1);
//print(list1[4]);

list1 = [11, [10, 20, 30], 33];
print(list1[1][2]);

list1[1][2] = 777;
print(list1);
*/
