import { Observable } from '../observable';
import { ObservableInput } from '../types';

const isPromiseLike = function isPromiseLike(target: any): target is PromiseLike<unknown> {
  return typeof target?.then === 'function';
};

const isArrayLike = function isArrayLike(target: any): target is ArrayLike<unknown> {
  return typeof target?.length === 'number';
};

const isObservable = function isObservable(target: any): target is Observable<unknown> {
  return typeof target?.subscribe === 'function';
};

/**
 * Creates an observable from a promise
 *
 * @param promise the promise to convert to observable
 * @returns observable
 */
function fromPromise<T>(promise: PromiseLike<T>): Observable<T> {
  return new Observable<T>((observer) => {
    promise.then(
      (value: T) => {
        observer.next(value);
        observer.complete();
      },
      (error: unknown) => {
        observer.error(error);
      },
    );
  });
}

/**
 * Creates an observable from a array
 *
 * @param array the array to convert to observable
 * @returns observable
 */
function fromArray<T>(array: ArrayLike<T>): Observable<T> {
  return new Observable<T>((observer) => {
    for (let i = 0; i < array.length; i++) {
      observer.next(array[i]);
    }
    observer.complete();
  });
}

/**
 * Creates an observable
 *
 * @param input the input to turn into an observable
 * @returns observable
 */
export function from<T>(input: ObservableInput<T>): Observable<T> {
  if (isPromiseLike(input)) {
    return fromPromise(input);
  }

  if (isArrayLike(input)) {
    return fromArray(input);
  }

  if (isObservable(input)) {
    return input;
  }

  // Throw if not recognized
  throw new Error('cannot create an observable for the given input');
}
