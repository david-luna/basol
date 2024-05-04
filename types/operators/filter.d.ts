/**
 * @template T
 * @param {(value: T) => boolean} check
 * @returns {import('../observable').OperatorFunction<T,T>}
 */
export function filter<T>(check: (value: T) => boolean): import("../observable.js").OperatorFunction<T, T>;
