import { Observable } from '../observable';

export type EventHandlerLike = (...args: unknown[]) => void;

/**
 * Creates an Observable from an arbitrary API for registering event handlers.
 *
 * @param addHandler
 * @param removeHandler
 * @param resultSelector
 * @returns observable
 */
export function fromEventPattern<T>(
  addHandler: (handler: EventHandlerLike) => unknown,
  removeHandler: (handler: EventHandlerLike, signal: unknown) => unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  project?: (...args: any[]) => T,
): Observable<T> {
  return new Observable<T>((observer) => {
    // TODO: next function is the actual handler
    // error just throws
    // unsubscribe uses the remove handler function
    const handler = (...args: unknown[]) => observer.next(project ? project(...args) : (args[0] as T));
    const signal = addHandler(handler);

    return () => {
      removeHandler(handler, signal);
    };
  });
}
