import { createObsevable } from '../observable.js';

/**
 * @param  {Array<unknown>} inputs
 * @returns {import('../observable').Observable<unknown>}
 */
export function of(...inputs) {
  return createObsevable((observer) => {
    inputs.forEach((input) => observer.next(input));
    observer.complete();
  });
}
