import { createObsevable } from '../observable.js';

/**
 * @type {import('../types').fromEventPattern<T>}
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
