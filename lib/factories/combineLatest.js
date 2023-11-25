import { createObsevable } from '../observable.js';

/**
 * @typedef {Object} ObservableSlot
 * @property {import('../types').Subscription} subscription
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
 * @param  {...import('../types').Observable<any>} observables
 * @returns {import('../types').Observable<any>}
 */
export function combineLatest(...observables) {
  return createObsevable((observer) => {
    /** @type {ObservableSlot[]} */
    const slots = [];
    let completedSubscriptions = 0;

    /** @type {(i: number) => import('../types').Observer<any>} */
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
