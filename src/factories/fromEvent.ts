import { Observable } from "../observable";

export interface EventListenerObject<E> {
  handleEvent(evt: E): void;
}

export interface HasEventTargetAddRemove<E> {
  addEventListener(
    type: string,
    listener: ((evt: E) => void) | EventListenerObject<E> | null,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: ((evt: E) => void) | EventListenerObject<E> | null,
    options?: EventListenerOptions | boolean
  ): void;
}

// TODO: we may add other types in the future
export type FromEventTarget<T> = HasEventTargetAddRemove<T>;

/**
 * Returns an observable which emits events from the given target
 *
 * @param target the target object
 * @param eventName the event name
 * @returns observable
 */
export function fromEvent<T>(target: FromEventTarget<T>, eventName: string): Observable<T> {
  return new Observable<T>((observer) => {
    const handler = (event: T): void => {
      observer.next(event);
    };

    target.addEventListener(eventName, handler);

    return () => {
      target.removeEventListener(eventName, handler);
    };
  });
}
