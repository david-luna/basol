import { createObsevable } from '../observable.js';

/** @type {import('../types').interval} */
export function interval(period) {
  return createObsevable((observer) => {
    let index = 0;
    const id = setInterval(() => observer.next(index++), period);
    return () => {
      clearInterval(id);
    };
  });
}
