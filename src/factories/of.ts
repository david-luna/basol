import { Observable } from '../observable';

/**
 * Creates an observable emiting the params in order
 *
 * @param inputs the inputs to turn into an observable
 * @returns observable
 */
export function of(...inputs: unknown[]): Observable<unknown> {
  return new Observable<unknown>((observer) => {
    for (let i = 0; i < inputs.length; i++) {
      observer.next(inputs[i]);
    }
    observer.complete();
  });
}
