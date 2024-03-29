import { createObsevable } from '../observable.js';

/**
 * @typedef {Object} ValueErrorSlot
 * @property {import('../types').Subscription} subscription
 * @property {unknown} [value]
 * @property {unknown} [error]
 */

/**
 * @param {Object} o
 * @returns {boolean}
 */
function withValue(o) {
  return Object.prototype.hasOwnProperty.call(o, 'value');
}

/**
 * @param {Object} o
 * @returns {boolean}
 */
function withError(o) {
  return Object.prototype.hasOwnProperty.call(o, 'error');
}

/**
 * @param  {...import('../types').Observable<any>} inputs
 * @returns {import('../types').OperatorFunction<any, any>}
 */
export function withLatestFrom(...inputs) {
  return (source) => {
    /** @type {ValueErrorSlot[]} */
    const slots = inputs.map((input, index) => {
      const subscription = input.subscribe({
        next: (value) => (slots[index].value = value),
        error: (error) => (slots[index].error = error),
      });
      return { subscription };
    });

    return createObsevable((observer) => {
      const subscription = source.subscribe({
        next: (value) => {
          const slotWithError = slots.find(withError);
          if (slotWithError) {
            observer.error(slotWithError.error);
          }
          if (slots.every(withValue)) {
            observer.next([value, ...slots.map((s) => s.value)]);
          }
        },
        error: (error) => observer.error(error),
        complete: () => observer.complete(),
      });
      return () => {
        slots.forEach((slot) => slot.subscription.unsubscribe());
        subscription.unsubscribe();
      };
    });
  };
}
