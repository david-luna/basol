import { createObsevable } from '../observable.js';

/**
 * @typedef {(...args: unknown[]) => void} EventHandlerLike
 */

/**
 * @template T
 * @param {(handler: EventHandlerLike) => unknown} addHandler
 * @param {(handler: EventHandlerLike, signal: unknown) => unknown} removeHandler
 * @param {(...args: any[]) => T} [project]
 * @returns {import('../types').Observable<T>}
 */
export function fromEventPattern(addHandler, removeHandler, project) {
  return createObsevable((observer) => {
    const handler = (...args) => observer.next(project ? project(...args) : args[0]);
    const signal = addHandler(handler);
    return () => {
      removeHandler(handler, signal);
    };
  });
}
