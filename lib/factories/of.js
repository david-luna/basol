import { createObsevable } from '../observable.js';

/**
 * @param  {Array<any>} inputs
 * @returns {import('../types').Observable<any>}
 */
export function of(...inputs) {
  return createObsevable((observer) => {
    inputs.forEach((input) => observer.next(input));
    observer.complete();
  });
}
