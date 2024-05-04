import { createObsevable } from '../observable.js';

/**
 * @typedef {Object} ValueErrorSlot
 * @property {import('../observable').Subscription} subscription
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
 * @template T,A,B
 * @overload
 * @param {import('../observable').Observable<A>} a
 * @param {import('../observable').Observable<B>} b
 * @returns {import('../observable').OperatorFunction<T,[A,B]>}
 */
/**
 * @template T,A,B,C
 * @overload
 * @param {import('../observable').Observable<A>} a
 * @param {import('../observable').Observable<B>} b
 * @param {import('../observable').Observable<C>} c
 * @returns {import('../observable').OperatorFunction<T,[A,B,C]>}
 */
/**
 * @template T,A,B,C,D
 * @overload
 * @param {import('../observable').Observable<A>} a
 * @param {import('../observable').Observable<B>} b
 * @param {import('../observable').Observable<C>} c
 * @param {import('../observable').Observable<D>} d
 * @returns {import('../observable').OperatorFunction<T,[A,B,C,D]>}
 */
/**
 * @template T,A,B,C,D,E
 * @overload
 * @param {import('../observable').Observable<A>} a
 * @param {import('../observable').Observable<B>} b
 * @param {import('../observable').Observable<C>} c
 * @param {import('../observable').Observable<D>} d
 * @param {import('../observable').Observable<E>} e
 * @returns {import('../observable').OperatorFunction<T,[A,B,C,D,E]>}
 */
/**
 * @param  {...import('../observable').Observable<any>} inputs
 * @returns {import('../observable').OperatorFunction<any, any>}
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
