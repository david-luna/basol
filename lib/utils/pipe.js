export function pipe(...fns) {
  return pipeFromArray(fns);
}
export function pipeFromArray(fns) {
  if (fns.length === 0) {
    return (x) => x;
  }
  if (fns.length === 1) {
    return fns[0];
  }
  return function (input) {
    return fns.reduce((arg, fn) => fn(arg), input);
  };
}
