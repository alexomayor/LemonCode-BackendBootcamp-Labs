const elements = [0, 1, false, 2, "", 3];

const compact = (arg) => {
  if (Array.isArray(arg)) {
    return arg.filter(function (n) {
      return !!n;
    });
  }
  if (arg && typeof arg === "object") {
    const newArg = {};
    for (const key in arg) {
      if (arg.hasOwnProperty(key) && !!arg[key]) {
        newArg[key] = arg[key];
      }
    }
    return newArg;
  } else {
    return arg;
  }
};

console.log(compact(123)); // 123
console.log(compact(null)); // null
console.log(compact([0, 1, false, 2, "", 3])); // [1, 2, 3]
console.log(compact({})); // {}
console.log(
  compact({
    price: 0,
    name: "cloud",
    altitude: NaN,
    taste: undefined,
    isAlive: false,
  })
); // {name: "cloud"}
