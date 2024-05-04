import { createObsevable } from '../observable.js';

/**
 * @template A,B
 * @overload
 * @param {import('../observable').Observable<A>} a
 * @param {import('../observable').Observable<B>} b
 * @returns {import('../observable').Observable<A|B>}
 */
/**
 * @template A,B,C
 * @overload
 * @param {import('../observable').Observable<A>} a
 * @param {import('../observable').Observable<B>} b
 * @param {import('../observable').Observable<C>} c
 * @returns {import('../observable').Observable<A|B|C>}
 */
/**
 * @template A,B,C,D
 * @overload
 * @param {import('../observable').Observable<A>} a
 * @param {import('../observable').Observable<B>} b
 * @param {import('../observable').Observable<C>} c
 * @param {import('../observable').Observable<D>} d
 * @returns {import('../observable').Observable<A|B|C|D>}
 */
/**
 * @template A,B,C,D,E
 * @overload
 * @param {import('../observable').Observable<A>} a
 * @param {import('../observable').Observable<B>} b
 * @param {import('../observable').Observable<C>} c
 * @param {import('../observable').Observable<D>} d
 * @param {import('../observable').Observable<E>} e
 * @returns {import('../observable').Observable<A|B|C|D|E>}
 */
/**
 * @param  {...import('../observable').Observable<any>} observables
 * @returns {import('../observable').Observable<any>}
 */
export function merge(...observables) {
  return createObsevable((observer) => {
    /** @type {import('../observable').Subscription[]} */
    const innerSubscriptions = [];
    let completedSubscriptions = 0;

    /** @type {import('../observable').Observer<any>} */
    const innerObserver = {
      next: (value) => {
        observer.next(value);
      },
      error: (err) => {
        observer.error(err);
      },
      complete: () => {
        completedSubscriptions++;
        if (completedSubscriptions === innerSubscriptions.length) {
          observer.complete();
        }
      },
    };
    observables.forEach((observable) => {
      innerSubscriptions.push(observable.subscribe(innerObserver));
    });
    return () => {
      innerSubscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
    };
  });
}
