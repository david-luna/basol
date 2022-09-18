import { Observable } from '../observable';
import { Subscription } from '../types';

type ObservableSlot = { subscription: Subscription; value?: unknown };

export function combineLatest<A, B>(a: Observable<A>, b: Observable<B>): Observable<[A, B]>;
export function combineLatest<A, B, C>(a: Observable<A>, b: Observable<B>, c: Observable<C>): Observable<[A, B, C]>;
export function combineLatest<A, B, C, D>(
  a: Observable<A>,
  b: Observable<B>,
  c: Observable<C>,
  d: Observable<D>,
): Observable<[A, B, C, D]>;
export function combineLatest<A, B, C, D, E>(
  a: Observable<A>,
  b: Observable<B>,
  c: Observable<C>,
  d: Observable<D>,
  e: Observable<E>,
): Observable<[A, B, C, D, E]>;

/**
 * Returns a new Observable whihch emits an array of the latests values
 *
 * @param observables list of observables
 * @returns an observable which emit an array with the latest values of each observable
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function combineLatest(...observables: Observable<any>[]): Observable<any> {
  return new Observable<unknown[]>((observer) => {
    const slots: ObservableSlot[] = [];
    let completedSubscriptions = 0;

    const indexedObserver = (index: number) => ({
      next: (value: unknown) => {
        slots[index].value = value;
        if (slots.every((s) => s.hasOwnProperty('value'))) {
          observer.next(slots.map((s) => s.value));
        }
      },
      error: (err: unknown) => {
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
