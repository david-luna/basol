import { Observable } from '../observable';

export function concat<A, B>(a: Observable<A>, b: Observable<B>): Observable<A | B>;
export function concat<A, B, C>(a: Observable<A>, b: Observable<B>, c: Observable<C>): Observable<A | B | C>;
export function concat<A, B, C, D>(
  a: Observable<A>,
  b: Observable<B>,
  c: Observable<C>,
  d: Observable<D>,
): Observable<A | B | C | D>;
export function concat<A, B, C, D, E>(
  a: Observable<A>,
  b: Observable<B>,
  c: Observable<C>,
  d: Observable<D>,
  e: Observable<E>,
): Observable<A | B | C | D | E>;
/**
 * Concats all observables passed as param into a new one
 *
 * @param observables list of observables to concat
 * @returns an observable which emit all values incoming from all observables
 */
export function concat(...observables: Observable<unknown>[]): Observable<unknown> {
  return new Observable<unknown>((observer) => {
    const innerObserver = {
      next: (value: unknown) => {
        observer.next(value);
      },
      error: (err: unknown) => {
        console.error('err', err);
        observer.error(err);
      },
      complete: () => {
        activeSubscription.unsubscribe();
        observables.shift();
        if (observables.length === 0) {
          observer.complete();
        } else {
          activeSubscription = observables[0].subscribe(innerObserver);
        }
      },
    };

    let activeSubscription = observables[0].subscribe(innerObserver);

    return () => {
      activeSubscription.unsubscribe();
    };
  });
}
