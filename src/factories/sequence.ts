import { Observable } from "../observable";

type SequenceFactory<T> = (index: number) => T;

export function sequence(period: number): Observable<number>;
export function sequence<T>(period: number, factory: SequenceFactory<T>): Observable<T>;
/**
 * Creates an observable emiting the results of the factory function which defaults to
 * ascending numbers. The factory function receives the previous value (void the 1st time)
 * and the number of the call.
 *
 * @param factory a factory function to emit other values than numbers
 * @param period the time between emissions
 * @returns observable
 */
export function sequence(
  period = 0,
  factory = (x: number) => x,
): Observable<any> {
  return new Observable<number>((observer) => {
    let index = 0;
    let value: any;

    const id = setInterval(() => observer.next(value = factory(index++)), period);

    return () => {
      clearInterval(id);
    };
  });
}
