/**
 * @template A,B
 * @overload
 * @param {import('../observable').Observable<A>} a
 * @param {import('../observable').Observable<B>} b
 * @returns {import('../observable').Observable<A|B>}
 */
export function merge<A, B>(a: import("../observable.js").Observable<A>, b: import("../observable.js").Observable<B>): import("../observable.js").Observable<A | B>;
/**
 * @template A,B,C
 * @overload
 * @param {import('../observable').Observable<A>} a
 * @param {import('../observable').Observable<B>} b
 * @param {import('../observable').Observable<C>} c
 * @returns {import('../observable').Observable<A|B|C>}
 */
export function merge<A, B, C>(a: import("../observable.js").Observable<A>, b: import("../observable.js").Observable<B>, c: import("../observable.js").Observable<C>): import("../observable.js").Observable<A | B | C>;
/**
 * @template A,B,C,D
 * @overload
 * @param {import('../observable').Observable<A>} a
 * @param {import('../observable').Observable<B>} b
 * @param {import('../observable').Observable<C>} c
 * @param {import('../observable').Observable<D>} d
 * @returns {import('../observable').Observable<A|B|C|D>}
 */
export function merge<A, B, C, D>(a: import("../observable.js").Observable<A>, b: import("../observable.js").Observable<B>, c: import("../observable.js").Observable<C>, d: import("../observable.js").Observable<D>): import("../observable.js").Observable<A | B | C | D>;
/**
 * @template A,B,C,D,E
 * @overload
 * @param {import('../observable').Observable<A>} a
 * @param {import('../observable').Observable<B>} b
 * @param {import('../observable').Observable<C>} c
 * @param {import('../observable').Observable<D>} d
 * @param {import('../observable').Observable<E>} e
 * @returns {import('../observable').Observable<A|B|C|D|E>}
 */
export function merge<A, B, C, D, E>(a: import("../observable.js").Observable<A>, b: import("../observable.js").Observable<B>, c: import("../observable.js").Observable<C>, d: import("../observable.js").Observable<D>, e: import("../observable.js").Observable<E>): import("../observable.js").Observable<A | B | C | D | E>;
