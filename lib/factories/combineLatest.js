import { createObsevable } from '../observable.js';

/**
 * @typedef {Object} ValueSlot
 * @property {import('../observable').Subscription} subscription
 * @property {unknown} [value]
 */

/**
 * Returns true if te object has a property named "value"
 * @param {Object} o
 * @returns {boolean}
 */
function withValue(o) {
  return Object.prototype.hasOwnProperty.call(o, 'value');
}

/**
 * @template A,B
 * @overload
 * @param {import('../observable').Observable<A>} a
 * @param {import('../observable').Observable<B>} b
 * @returns {import('../observable').Observable<[A,B]>}
 */
/**
 * @template A,B,C
 * @overload
 * @param {import('../observable').Observable<A>} a
 * @param {import('../observable').Observable<B>} b
 * @param {import('../observable').Observable<C>} c
 * @returns {import('../observable').Observable<[A,B,C]>}
 */
/**
 * @template A,B,C,D
 * @overload
 * @param {import('../observable').Observable<A>} a
 * @param {import('../observable').Observable<B>} b
 * @param {import('../observable').Observable<C>} c
 * @param {import('../observable').Observable<D>} d
 * @returns {import('../observable').Observable<[A,B,C,D]>}
 */
/**
 * @template A,B,C,D,E
 * @overload
 * @param {import('../observable').Observable<A>} a
 * @param {import('../observable').Observable<B>} b
 * @param {import('../observable').Observable<C>} c
 * @param {import('../observable').Observable<D>} d
 * @param {import('../observable').Observable<E>} e
 * @returns {import('../observable').Observable<[A,B,C,D,E]>}
 */
/**
 * @param  {...import('../observable').Observable<any>} observables
 * @returns {import('../observable').Observable<any>}
 */
export function combineLatest(...observables) {
  return createObsevable((observer) => {
    /** @type {ValueSlot[]} */
    const slots = [];
    let completedSubscriptions = 0;

    /** @type {(i: number) => import('../observable').Observer<any>} */
    const indexedObserver = (index) => ({
      next: (value) => {
        slots[index].value = value;
        if (slots.every(withValue)) {
          observer.next(slots.map((s) => s.value));
        }
      },
      error: (err) => {
        observer.error(err);
      },
      complete: () => {
        completedSubscriptions++;
        if (completedSubscriptions === slots.length) {
          observer.complete();
        }
      },
    });

    observables.forEach((observable, index) => {
      slots.push({ subscription: observable.subscribe(indexedObserver(index)) });
    });

    return () => {
      slots.forEach((slot) => {
        slot.subscription.unsubscribe();
      });
    };
  });
}
