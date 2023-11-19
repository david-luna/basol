import { createObsevable } from '../observable.js';

/**
 * @type {import('../types').sequence<T>}
 */
export function sequence(period = 0, factory = (x) => x) {
  return createObsevable((observer) => {
    let index = 0;
    const id = setInterval(() => observer.next(factory(index++)), period);
    return () => {
      clearInterval(id);
    };
  });
}
