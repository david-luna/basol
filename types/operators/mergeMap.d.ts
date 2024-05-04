/**
 * @template T,R
 * @param {(value: T, index: number) => import('../observable').Observable<R>} project
 * @returns {import('../observable').OperatorFunction<T,R>}
 */
export function mergeMap<T, R>(project: (value: T, index: number) => import("../observable.js").Observable<R>): import("../observable.js").OperatorFunction<T, R>;
