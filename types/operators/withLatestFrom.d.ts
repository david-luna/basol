/**
 * @template T,A,B
 * @overload
 * @param {import('../observable').Observable<A>} a
 * @param {import('../observable').Observable<B>} b
 * @returns {import('../observable').OperatorFunction<T,[A,B]>}
 */
export function withLatestFrom<T, A, B>(a: import("../observable.js").Observable<A>, b: import("../observable.js").Observable<B>): import("../observable.js").OperatorFunction<T, [A, B]>;
/**
 * @template T,A,B,C
 * @overload
 * @param {import('../observable').Observable<A>} a
 * @param {import('../observable').Observable<B>} b
 * @param {import('../observable').Observable<C>} c
 * @returns {import('../observable').OperatorFunction<T,[A,B,C]>}
 */
export function withLatestFrom<T, A, B, C>(a: import("../observable.js").Observable<A>, b: import("../observable.js").Observable<B>, c: import("../observable.js").Observable<C>): import("../observable.js").OperatorFunction<T, [A, B, C]>;
/**
 * @template T,A,B,C,D
 * @overload
 * @param {import('../observable').Observable<A>} a
 * @param {import('../observable').Observable<B>} b
 * @param {import('../observable').Observable<C>} c
 * @param {import('../observable').Observable<D>} d
 * @returns {import('../observable').OperatorFunction<T,[A,B,C,D]>}
 */
export function withLatestFrom<T, A, B, C, D>(a: import("../observable.js").Observable<A>, b: import("../observable.js").Observable<B>, c: import("../observable.js").Observable<C>, d: import("../observable.js").Observable<D>): import("../observable.js").OperatorFunction<T, [A, B, C, D]>;
/**
 * @template T,A,B,C,D,E
 * @overload
 * @param {import('../observable').Observable<A>} a
 * @param {import('../observable').Observable<B>} b
 * @param {import('../observable').Observable<C>} c
 * @param {import('../observable').Observable<D>} d
 * @param {import('../observable').Observable<E>} e
 * @returns {import('../observable').OperatorFunction<T,[A,B,C,D,E]>}
 */
export function withLatestFrom<T, A, B, C, D, E>(a: import("../observable.js").Observable<A>, b: import("../observable.js").Observable<B>, c: import("../observable.js").Observable<C>, d: import("../observable.js").Observable<D>, e: import("../observable.js").Observable<E>): import("../observable.js").OperatorFunction<T, [A, B, C, D, E]>;
export type ValueErrorSlot = {
    subscription: import('../observable').Subscription;
    value?: unknown;
    error?: unknown;
};
