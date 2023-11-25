import { createObsevable } from '../observable.js';

/**
 * @template T
 * @param {number} period
 * @param {(index: number) => T} factory
 * @returns {import('../types').Observable<T>}
 */
// @ts-ignore -- skip the check for default factory
export function sequence(period = 0, factory = (x) => x) {
  return createObsevable((observer) => {
    let index = 0;
    const id = setInterval(() => observer.next(factory(index++)), period);
    return () => {
      clearInterval(id);
    };
  });
}
