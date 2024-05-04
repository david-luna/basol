/**
 * @template T
 * @param {(value: T, index: number) => boolean} predicate
 * @param {boolean} inclusive
 * @returns {import('../observable').OperatorFunction<T, T>}
 */
export function takeWhile<T>(predicate: (value: T, index: number) => boolean, inclusive?: boolean): import("../observable.js").OperatorFunction<T, T>;
