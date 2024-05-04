/**
 * @template T
 * @param {number} count
 * @returns {import('../observable').OperatorFunction<T,T>}
 */
export function take<T>(count: number): import("../observable.js").OperatorFunction<T, T>;
