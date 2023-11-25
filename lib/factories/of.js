import { createObsevable } from '../observable.js';

/**
 * @param  {Array<unknown>} inputs
 * @returns {import('../types').Observable<unknown>}
 */
export function of(...inputs) {
  return createObsevable((observer) => {
    inputs.forEach((input) => observer.next(input));
    observer.complete();
    // TODO: remove this
    return () => undefined;
  });
}
