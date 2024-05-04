/**
 * @template T
 * @param {number} period
 * @param {(index: number) => T} factory
 * @returns {import('../observable').Observable<T>}
 */
export function sequence<T>(period?: number, factory?: (index: number) => T): import("../observable.js").Observable<T>;
