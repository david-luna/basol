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
    addHandler: (handler: EventHandlerLike) => any,
    removeHandler: (handler: EventHandlerLike, signal: any) => any,
    project?: (...args: any[]) => T,
): Observable<T> {
  return new Observable<T>((observer) => {
    // TODO: next function is the actual handler
    // error just throws
    // unsubscribe uses the remove handler function
    const handler = !project ? observer.next : (...args) => observer.next(project(...args));
    const signal = addHandler(handler);

    return () => {
      removeHandler(handler, signal);
    };
  });
}
