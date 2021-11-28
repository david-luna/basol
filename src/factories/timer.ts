import { Observable } from '../observable';

/**
 * Creates an observable emiting a void value after the given time or at the given date
 *
 * @param due If a number, the amount of time in milliseconds to wait before emitting. If a Date, the exact time at which to emit.
 * @returns observable
 */
export function timer(due: number | Date): Observable<void> {
  return new Observable<void>((observer) => {
    const time = typeof due === 'number' ? due : due.getTime() - Date.now();

    // TODO: throw if time < 0????
    const id = setTimeout(() => {
      observer.next();
      observer.complete();
    }, time);

    return () => {
      clearTimeout(id);
    };
  });
}
