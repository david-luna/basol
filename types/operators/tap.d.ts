/**
 * @template T
 * @param {(value: T) => void} fn
 * @returns {import('../observable').OperatorFunction<T,T>}
 */
export function tap<T>(fn: (value: T) => void): import("../observable.js").OperatorFunction<T, T>;
