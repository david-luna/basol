import { Observable } from '../observable.js';

/**
 * @typedef {import('../types.d.ts').Observable<unknown>} OservableUnknown
 */

/**
 * Returns true if te object has a property named "value"
 *
 * @param {Object} o
 * @returns {boolean}
 */
function withValue(o) {
  return Object.prototype.hasOwnProperty.call(o, 'value');
}

// TODO: figure out how to type this funciton accepting a variable
// num of type parameters
export function combineLatest(...observables) {
  return new Observable((observer) => {
    const slots = [];
    let completedSubscriptions = 0;
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
