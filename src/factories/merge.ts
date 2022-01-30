import { Observable } from '../observable';
import { Subscription } from '../types';

export function merge<A, B>(a: Observable<A>, b: Observable<B>): Observable<A | B>;
export function merge<A, B, C>(a: Observable<A>, b: Observable<B>, c: Observable<C>): Observable<A | B | C>;
export function merge<A, B, C, D>(
  a: Observable<A>,
  b: Observable<B>,
  c: Observable<C>,
  d: Observable<D>,
): Observable<A | B | C | D>;
export function merge<A, B, C, D, E>(
  a: Observable<A>,
  b: Observable<B>,
  c: Observable<C>,
  d: Observable<D>,
  e: Observable<E>,
): Observable<A | B | C | D | E>;
/**
 * Merges all observables passed as param into a new one
 *
 * @param observables list of observables to merge
 * @returns an observable which emit all values incoming from all observables
 */
export function merge(...observables: Observable<unknown>[]): Observable<unknown> {
  return new Observable<unknown>((observer) => {
    const innerSubscriptions: Subscription[] = [];
    let completedSubscriptions = 0;
    const innerObserver = {
      next: (value: unknown) => {
        observer.next(value);
      },
      error: (err: unknown) => {
        observer.error(err);
      },
      complete: () => {
        completedSubscriptions++;
        if (completedSubscriptions === innerSubscriptions.length) {
          observer.complete();
        }
      },
    };

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < observables.length; i++) {
      innerSubscriptions.push(observables[i].subscribe(innerObserver));
    }

    return () => {
      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < innerSubscriptions.length; i++) {
        innerSubscriptions[i].unsubscribe();
      }
    };
  });
}
