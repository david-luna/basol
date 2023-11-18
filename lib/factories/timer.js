import { createObsevable } from '../observable.js';

/** @type {import('../types').timer} */
export function timer(due) {
  return createObsevable((observer) => {
    const time = typeof due === 'number' ? due : due.getTime() - Date.now();
    const id = setTimeout(() => {
      observer.next();
      observer.complete();
    }, time);

    return () => {
      clearTimeout(id);
    };
  });
}
