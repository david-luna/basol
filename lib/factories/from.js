import { Observable } from '../observable.js';
function isPromiseLike(target) {
  return typeof (target === null || target === void 0 ? void 0 : target.then) === 'function';
}
function isArrayLike(target) {
  return typeof (target === null || target === void 0 ? void 0 : target.length) === 'number';
}
function isObservable(target) {
  return typeof (target === null || target === void 0 ? void 0 : target.subscribe) === 'function';
}

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
function fromArray(array) {
  return new Observable((observer) => {
    for (let i = 0; i < array.length; i++) {
      observer.next(array[i]);
    }
    observer.complete();
  });
}

// TODO: import types
export function from(input) {
  if (isPromiseLike(input)) {
    return fromPromise(input);
  }
  if (isArrayLike(input)) {
    return fromArray(input);
  }
  if (isObservable(input)) {
    return input;
  }
  throw new Error('cannot create an observable for the given input');
}
