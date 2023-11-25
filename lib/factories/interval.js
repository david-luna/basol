import { createObsevable } from '../observable.js';

/**
 * @param {number} period 
 * @returns {import('../types').Observable<number>}
 */
export function interval(period) {
  return createObsevable((observer) => {
    let index = 0;
    const id = setInterval(() => observer.next(index++), period);
    return () => {
      clearInterval(id);
    };
  });
}
