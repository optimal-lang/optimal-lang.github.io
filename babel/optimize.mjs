export function optimize(x) {
  if (x == null) return x;
  switch (typeof x) {
    case "object":
      Object.keys(x).forEach(function (key) {
        if (key === "loc" || key === "start" || key === "end") delete x[key];
        else x[key] = optimize(x[key]);
      });
      return x;
    case "array":
      for (let i = 0; i < x.length; i++) {
        x[i] = optimize(x[i]);
      }
      return x;
    default:
      return x;
  }
}
