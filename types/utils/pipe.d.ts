/**
 * @template T
 * @overload
 * @returns {(x: T) => T}
 */
export function pipe<T>(): (x: T) => T;
/**
 * @template T,A
 * @overload
 * @param {UnaryFunction<T,A>} fn1
 * @returns {UnaryFunction<T,A>}
 */
export function pipe<T, A>(fn1: UnaryFunction<T, A>): UnaryFunction<T, A>;
/**
 * @template T,A,B
 * @overload
 * @param {UnaryFunction<T,A>} fn1
 * @param {UnaryFunction<A,B>} fn2
 * @returns {UnaryFunction<T,B>}
 */
export function pipe<T, A, B>(fn1: UnaryFunction<T, A>, fn2: UnaryFunction<A, B>): UnaryFunction<T, B>;
/**
 * @template T,A,B,C
 * @overload
 * @param {UnaryFunction<T,A>} fn1
 * @param {UnaryFunction<A,B>} fn2
 * @param {UnaryFunction<B,C>} fn3
 * @returns {UnaryFunction<T,C>}
 */
export function pipe<T, A, B, C>(fn1: UnaryFunction<T, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>): UnaryFunction<T, C>;
/**
 * @template T,A,B,C,D
 * @overload
 * @param {UnaryFunction<T,A>} fn1
 * @param {UnaryFunction<A,B>} fn2
 * @param {UnaryFunction<B,C>} fn3
 * @param {UnaryFunction<C,D>} fn4
 * @returns {UnaryFunction<T,D>}
 */
export function pipe<T, A, B, C, D>(fn1: UnaryFunction<T, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>, fn4: UnaryFunction<C, D>): UnaryFunction<T, D>;
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
export function pipe<T, A, B, C, D, E>(fn1: UnaryFunction<T, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>, fn4: UnaryFunction<C, D>, fn5: UnaryFunction<D, E>): UnaryFunction<T, E>;
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
export function pipe<T, A, B, C, D, E, F>(fn1: UnaryFunction<T, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>, fn4: UnaryFunction<C, D>, fn5: UnaryFunction<D, E>, fn6: UnaryFunction<E, F>): UnaryFunction<T, F>;
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
export function pipe<T, A, B, C, D, E, F, G>(fn1: UnaryFunction<T, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>, fn4: UnaryFunction<C, D>, fn5: UnaryFunction<D, E>, fn6: UnaryFunction<E, F>, fn7: UnaryFunction<F, G>): UnaryFunction<T, G>;
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
export function pipe<T, A, B, C, D, E, F, G, H>(fn1: UnaryFunction<T, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>, fn4: UnaryFunction<C, D>, fn5: UnaryFunction<D, E>, fn6: UnaryFunction<E, F>, fn7: UnaryFunction<F, G>, fn8: UnaryFunction<G, H>): UnaryFunction<T, H>;
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
export function pipe<T, A, B, C, D, E, F, G, H>(fn1: UnaryFunction<T, A>, fn2: UnaryFunction<A, B>, fn3: UnaryFunction<B, C>, fn4: UnaryFunction<C, D>, fn5: UnaryFunction<D, E>, fn6: UnaryFunction<E, F>, fn7: UnaryFunction<F, G>, fn8: UnaryFunction<G, H>, ...fnRest: ((...args: any[]) => any)[]): UnaryFunction<T, unknown>;
export function pipeFromArray(fns: any): any;
export type UnaryFunction<T, R> = (source: T) => R;
