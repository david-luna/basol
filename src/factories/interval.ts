import { Observable } from "../observable";

/**
 * Creates an observable emiting ascending numbers with a period of miliseconds between emissions.
 *
 * @param period the time between emissions
 * @returns observable
 */
export function interval(period: number): Observable<number> {
  return new Observable<number>((observer) => {
    let index = 0;

    const id = setInterval(() => observer.next(index++), period);

    return () => {
      clearInterval(id);
    };
  });
}
