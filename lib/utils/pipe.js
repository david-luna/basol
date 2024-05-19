/**
 * @template T,R
 * @callback UnaryFunction
 * @param {T} source
 * @returns {R}
 */

/**
 * @template T
 * @overload
 * @returns {(x: T) => T}
 */
/**
 * @template T,A
 * @overload
 * @param {UnaryFunction<T,A>} fn1
 * @returns {UnaryFunction<T,A>}
 */
/**
 * @template T,A,B
 * @overload
 * @param {UnaryFunction<T,A>} fn1
 * @param {UnaryFunction<A,B>} fn2
 * @returns {UnaryFunction<T,B>}
 */
/**
 * @template T,A,B,C
 * @overload
 * @param {UnaryFunction<T,A>} fn1
 * @param {UnaryFunction<A,B>} fn2
 * @param {UnaryFunction<B,C>} fn3
 * @returns {UnaryFunction<T,C>}
 */
/**
 * @template T,A,B,C,D
 * @overload
 * @param {UnaryFunction<T,A>} fn1
 * @param {UnaryFunction<A,B>} fn2
 * @param {UnaryFunction<B,C>} fn3
 * @param {UnaryFunction<C,D>} fn4
 * @returns {UnaryFunction<T,D>}
 */
/**
 * @template T,A,B,C,D,E
 * @overload
 * @param {UnaryFunction<T,A>} fn1
 * @param {UnaryFunction<A,B>} fn2
 * @param {UnaryFunction<B,C>} fn3
 * @param {UnaryFunction<C,D>} fn4
 * @param {UnaryFunction<D,E>} fn5
 * @returns {UnaryFunction<T,E>}
 */
/**
 * @template T,A,B,C,D,E,F
 * @overload
 * @param {UnaryFunction<T,A>} fn1
 * @param {UnaryFunction<A,B>} fn2
 * @param {UnaryFunction<B,C>} fn3
 * @param {UnaryFunction<C,D>} fn4
 * @param {UnaryFunction<D,E>} fn5
 * @param {UnaryFunction<E,F>} fn6
 * @returns {UnaryFunction<T,F>}
 */
/**
 * @template T,A,B,C,D,E,F,G
 * @overload
 * @param {UnaryFunction<T,A>} fn1
 * @param {UnaryFunction<A,B>} fn2
 * @param {UnaryFunction<B,C>} fn3
 * @param {UnaryFunction<C,D>} fn4
 * @param {UnaryFunction<D,E>} fn5
 * @param {UnaryFunction<E,F>} fn6
 * @param {UnaryFunction<F,G>} fn7
 * @returns {UnaryFunction<T,G>}
 */
/**
 * @template T,A,B,C,D,E,F,G,H
 * @overload
 * @param {UnaryFunction<T,A>} fn1
 * @param {UnaryFunction<A,B>} fn2
 * @param {UnaryFunction<B,C>} fn3
 * @param {UnaryFunction<C,D>} fn4
 * @param {UnaryFunction<D,E>} fn5
 * @param {UnaryFunction<E,F>} fn6
 * @param {UnaryFunction<F,G>} fn7
 * @param {UnaryFunction<G,H>} fn8
 * @returns {UnaryFunction<T,H>}
 */
/**
 * @template T,A,B,C,D,E,F,G,H
 * @overload
 * @param {UnaryFunction<T,A>} fn1
 * @param {UnaryFunction<A,B>} fn2
 * @param {UnaryFunction<B,C>} fn3
 * @param {UnaryFunction<C,D>} fn4
 * @param {UnaryFunction<D,E>} fn5
 * @param {UnaryFunction<E,F>} fn6
 * @param {UnaryFunction<F,G>} fn7
 * @param {UnaryFunction<G,H>} fn8
 * @param {...((...args: any[]) => any)} fnRest
 * @returns {UnaryFunction<T,unknown>}
 */
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
