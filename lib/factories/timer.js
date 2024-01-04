import { createObsevable } from '../observable.js';

/**
 * @param {number | Date} due
 * @returns {import('../types').Observable<void>}
 */
export function timer(due) {
  return createObsevable((observer) => {
    const time = typeof due === 'number' ? due : due.getTime() - Date.now();
    const id = setTimeout(
      () => {
        observer.next();
        observer.complete();
      },
      time >= 0 ? time : 0,
    );

    return () => {
      clearTimeout(id);
    };
  });
}
