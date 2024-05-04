/**
 * @typedef {(...args: unknown[]) => void} EventHandlerLike
 */
/**
 * @template T
 * @param {(handler: EventHandlerLike) => unknown} addHandler
 * @param {(handler: EventHandlerLike, signal: unknown) => unknown} removeHandler
 * @param {(...args: any[]) => T} [project]
 * @returns {import('../observable').Observable<T>}
 */
export function fromEventPattern<T>(addHandler: (handler: EventHandlerLike) => unknown, removeHandler: (handler: EventHandlerLike, signal: unknown) => unknown, project?: (...args: any[]) => T): import("../observable.js").Observable<T>;
export type EventHandlerLike = (...args: unknown[]) => void;
