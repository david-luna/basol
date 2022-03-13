import { Observable } from '../observable';
import { TeardownFunction } from '../types';

export interface ObservableWithSpies<T> {
  observable: Observable<T>;
  triggers: {
    next?: (value: T) => void;
    error?: (error: unknown) => void;
    complete?: () => void;
  };
  spies: {
    next?: jest.SpyInstance;
    error?: jest.SpyInstance;
    complete?: jest.SpyInstance;
    tearDown?: jest.SpyInstance;
  };
}

export const newObservableWithSpies = <T>(): ObservableWithSpies<T> => {
  const result = { triggers: {}, spies: {} } as unknown as ObservableWithSpies<T>;
  const observable = new Observable<T>((observer) => {
    result.triggers.next = (value: T): void => {
      return observer.next(value);
    };
    result.triggers.error = (err: unknown) => {
      return observer.error(err);
    };
    result.triggers.complete = () => {
      return observer.complete();
    };

    return result.spies.tearDown as unknown as TeardownFunction;
  });

  result.spies.tearDown = jest.fn();
  result.observable = observable;

  return result;
};
