import { Observable } from '../observable.js';

function isPromiseLike(target) {
  return typeof target?.then === 'function';
}
function isArrayLike(target) {
  return typeof target?.length === 'number';
}
function isObservable(target) {
  return typeof target?.subscribe === 'function';
}

/**
 * @template T
 * @param {PromiseLike<T>} promise
 * @returns {import('../types.d.ts').Observable<T>}
 */
function fromPromise(promise) {
  return new Observable((observer) => {
    promise.then(
      (value) => {
        observer.next(value);
        observer.complete();
      },
      (error) => {
        observer.error(error);
      },
    );
  });
}

/**
 * @template T
 * @param {ArrayLike<T>} array
 * @returns {import('../types.d.ts').Observable<T>}
 */
function fromArray(array) {
  return new Observable((observer) => {
    for (let i = 0; i < array.length; i++) {
      observer.next(array[i]);
    }
    observer.complete();
  });
}

/** @type {import('../types.d.ts').from<T>} */
export function from(input) {
  if (isPromiseLike(input)) {
    // @ts-ignore
    return fromPromise(input);
  }
  if (isArrayLike(input)) {
    // @ts-ignore
    return fromArray(input);
  }
  if (isObservable(input)) {
    // @ts-ignore
    return input;
  }
  throw new Error('cannot create an observable for the given input');
}
