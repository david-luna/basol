/**
 * @template T, R
 * @param {(value: T) => R} project
 * @returns {import('../observable').OperatorFunction<T,R>}
 */
export function map<T, R>(project: (value: T) => R): import("../observable.js").OperatorFunction<T, R>;
