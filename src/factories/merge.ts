import { Observable } from "../observable";
import { Subscription } from "../types";

export function merge<A, B>(a: Observable<A>, b: Observable<B>): Observable<A | B>;
export function merge<A, B, C>(a: Observable<A>, b: Observable<B>, c: Observable<C>): Observable<A | B | C>;
export function merge<A, B, C, D>(a: Observable<A>, b: Observable<B>, c: Observable<C>, d: Observable<D>): Observable<A | B | C | D>;
export function merge<A, B, C, D, E>(a: Observable<A>, b: Observable<B>, c: Observable<C>, d: Observable<D>, e: Observable<E>): Observable<A | B | C | D | E>;
/**
 * Merges all observables passed as param into a new one
 *
 * @param observables list of observables to merge
 * @returns an observable which emit all values incoming from all observables
 */
export function merge(...observables: Observable<any>[]): Observable<any> {
  return new Observable<any>((observer) => {
    const innerSubscriptions: Subscription[] = [];
    let completedSubscriptions = 0;
    const innerObserver = {
      next: (value: any) => {
        observer.next(value);
      },
      error: (err: any) => {
        observer.error(err);
      },
      complete: () => {
        completedSubscriptions++;
        if (completedSubscriptions === innerSubscriptions.length) {
          console.log('merge complete');
          observer.complete();
        }
      }
    };

    for (let i = 0; i < observables.length; i++) {
      innerSubscriptions.push(observables[i].subscribe(innerObserver));
    }

    return () => {
      for (let i = 0; i < innerSubscriptions.length; i++) {
        innerSubscriptions[i].unsubscribe();
      }
    };
  });
}
