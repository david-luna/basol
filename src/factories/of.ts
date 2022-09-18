import { Observable } from '../observable';

/**
 * Creates an observable emiting the params in order
 *
 * @param inputs the inputs to turn into an observable
 * @returns observable
 */
export function of(...inputs: unknown[]): Observable<unknown> {
  return new Observable<unknown>((observer) => {
    inputs.forEach((input) => observer.next(input));
    observer.complete();
  });
}
