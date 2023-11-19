import { createObsevable } from '../observable.js';
/**
 * @type {import('../types').fromEvent<T>}
 */
export function fromEvent(target, eventName) {
  return createObsevable((observer) => {
    const handler = (event) => observer.next(event);

    target.addEventListener(eventName, handler);
    return () => {
      target.removeEventListener(eventName, handler);
    };
  });
}
