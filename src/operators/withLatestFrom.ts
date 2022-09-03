import { Observable } from '../observable';
import { OperatorFunction, Subscription } from '../types';

type ObservableSlot = { subscription: Subscription; value?: unknown; error?: unknown };

// eslint-disable-next-line prettier/prettier
export function withLatestFrom<T, A, B>(
  a: Observable<A>,
  b: Observable<B>,
  ): OperatorFunction<T, [T, A, B]>;
export function withLatestFrom<T, A, B, C>(
  a: Observable<A>,
  b: Observable<B>,
  c: Observable<C>,
): OperatorFunction<T, [T, A, B, C]>;
export function withLatestFrom<T, A, B, C, D>(
  a: Observable<A>,
  b: Observable<B>,
  c: Observable<C>,
  d: Observable<D>,
): OperatorFunction<T, [T, A, B, C, D]>;
export function withLatestFrom<T, A, B, C, D, E>(
  a: Observable<A>,
  b: Observable<B>,
  c: Observable<C>,
  d: Observable<D>,
  e: Observable<E>,
): OperatorFunction<T, [T, A, B, C, D, E]>;
/**
 * Combines each value from the source Observable (the instance) with the latest values
 * from the other input Observables only when the source emits a value, optionally
 * using a project function to determine the value to be emitted on the output Observable.
 * All input Observables must emit at least one value before the output Observable will
 * emit a value.
 *
 * @param inputs the observables to take
 * @returns function
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withLatestFrom(...inputs: Observable<any>[]): OperatorFunction<any, any> {
  return (source: Observable<unknown>): Observable<unknown> => {
    const slots: ObservableSlot[] = inputs.map((input, index) => {
      const subscription = input.subscribe({
        next: (value) => (slots[index].value = value),
        error: (error) => (slots[index].error = error),
      });

      return { subscription };
    });

    return new Observable<unknown>((observer) => {
      const subscription = source.subscribe({
        next: (value) => {
          const slotWithError = slots.find((s) => s.hasOwnProperty('error'));
          if (slotWithError) {
            observer.error(slotWithError.error);
          }
          if (slots.every((s) => s.hasOwnProperty('value'))) {
            observer.next([value, ...slots.map((s) => s.value)]);
          }
        },
        error: (error) => observer.error(error),
        complete: () => observer.complete(),
      });

      return () => {
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < slots.length; i++) {
          slots[i].subscription.unsubscribe();
        }
        subscription.unsubscribe();
      };
    });
  };
}
