import { createObsevable } from '../observable.js';

/**
 * NOTE: to mimic browser's CustomEvent
 * @typedef {Event | Event & { detail: any }} NodeOrBrowserEvent
 */
/**
 * @template {NodeOrBrowserEvent} T
 * @callback EventListenerFn
 * @param {string} type
 * @param {((e: T) => void) | { handleEvent: (e: T) => void } | null} listener
 * @param {any} [options]
 */
/**
 * @template {NodeOrBrowserEvent} T
 * @typedef {Object} EventTargetLike<T>
 * @property {EventListenerFn<T>} addEventListener
 * @property {EventListenerFn<T>} removeEventListener
 */
/**
 * @template {(...args: any[]) => void} T
 * @callback ListenerFn
 * @param {string} type
 * @param {T} listener
 * @param {any} [options]
 */
/**
 * @template {(...args: any[]) => void} T
 * @typedef {Object} EventEmitterLike<T>
 * @property {ListenerFn<T>} addListener
 * @property {ListenerFn<T>} removeListener
 */
/**
 * @template T
 * @typedef {T extends EventTargetLike<infer E> ? E : never} EventParam<T>
 */
/**
 * @template T
 * @typedef {T extends EventEmitterLike<infer F> ? Parameters<F> : EventParam<T>} EventOrParams<T>
 */

/**
 * @param {EventTargetLike<any>} target
 * @param {string} eventName
 * @returns {import('../observable').Observable<any>}
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
 * @param {EventEmitterLike<any>} target
 * @param {string} eventName
 * @returns {import('../observable').Observable<any>}
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

/**
 * @template {EventTargetLike<any> | EventEmitterLike<any>} T
 * @param {T} target
 * @param {string} eventName
 * @returns {import('../observable').Observable<EventOrParams<T>>}
 */
export function fromEvent(target, eventName) {
  /** @type {any} */
  const t = target;

  if (typeof t.addEventListener === 'function') {
    return fromEventTarget(t, eventName);
  } else if (typeof t.addListener === 'function') {
    return fromEventEmitter(t, eventName);
  }

  throw new Error('cannot create an observable for the given input');
}
