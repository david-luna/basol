import { createObsevable } from '../observable.js';

/**
 * @param {import('../types').EventTargetLike<any>} target
 * @param {string} eventName
 * @returns {import('../types').Observable<any>}
 */
function fromEventTarget(target, eventName) {
  return createObsevable((observer) => {
    const handler = (event) => observer.next(event);

    target.addEventListener(eventName, handler);
    return () => {
      target.removeEventListener(eventName, handler);
    };
  });
}

/**
 * @param {import('../types').EventEmitterLike<any>} target
 * @param {string} eventName
 * @returns {import('../types').Observable<any>}
 */
function fromEventEmitter(target, eventName) {
  return createObsevable((observer) => {
    const handler = (...args) => observer.next(args);

    target.addListener(eventName, handler);
    return () => {
      target.removeListener(eventName, handler);
    };
  });
}

// /**
//  * Returns an observable from
//  * @param {any} target
//  * @param {string} eventName
//  * @returns {import('../types').Observable<any>}
//  */
export function fromEvent(target, eventName) {
  if (typeof target.addEventListener === 'function') {
    return fromEventTarget(target, eventName);
  } else if (typeof target.addListener === 'function') {
    return fromEventEmitter(target, eventName);
  }

  throw new Error('cannot create an observable for the given input');
}
