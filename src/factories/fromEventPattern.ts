import { Observable } from '../observable';

export type NodeEventHandler = (...args: any[]) => void;

/**
 * Creates an Observable from an arbitrary API for registering event handlers.
 *
 * @param addHandler 
 * @param removeHandler 
 * @param resultSelector
 * @returns observable
 */
export function fromEventPattern<T>(
    addHandler: (handler: NodeEventHandler) => any,
    removeHandler: (handler: NodeEventHandler, signal: any) => any,
    resultSelector: (...args: any[]) => T,
): Observable<T> {
  return new Observable<T>((observer) => {
    // TODO: next function is the actual handler
    // error just throws
    // unsubscribe uses the remove handler function
  });
}
