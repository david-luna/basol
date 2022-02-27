import { concat } from './concat';
import { Observable } from '../observable';
import { TeardownFunction } from '../types';

interface ObservableWithSpies<T> {
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

const newObservableWithSpies = <T>(): ObservableWithSpies<T> => {
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

describe('concat factory', () => {
  test('should create an observable which emits values from all other observables in order', () => {
    const numberSpiedObservable = newObservableWithSpies<number>();
    const stringSpiedObservable = newObservableWithSpies<string>();
    const booleanSpiedObservable = newObservableWithSpies<boolean>();

    const concatenated = concat(
      numberSpiedObservable.observable,
      stringSpiedObservable.observable,
      booleanSpiedObservable.observable,
    );

    const concatNextSpy = jest.fn();
    const concatErrorSpy = jest.fn();
    const concatCompleteSpy = jest.fn();
    const subscription = concatenated.subscribe({
      next: concatNextSpy,
      error: concatErrorSpy,
      complete: concatCompleteSpy,
    });

    numberSpiedObservable.triggers.next?.(1);
    stringSpiedObservable.triggers.next?.('one');
    booleanSpiedObservable.triggers.next?.(true);
    numberSpiedObservable.triggers.next?.(2);
    stringSpiedObservable.triggers.next?.('two');
    booleanSpiedObservable.triggers.next?.(false);
    numberSpiedObservable.triggers.next?.(3);
    numberSpiedObservable.triggers.complete?.();
    stringSpiedObservable.triggers.next?.('three');
    stringSpiedObservable.triggers.complete?.();
    booleanSpiedObservable.triggers.next?.(true);
    booleanSpiedObservable.triggers.complete?.();

    expect(concatNextSpy).toHaveBeenNthCalledWith(1, 1);
    expect(concatNextSpy).toHaveBeenNthCalledWith(2, 2);
    expect(concatNextSpy).toHaveBeenNthCalledWith(3, 3);
    expect(concatNextSpy).toHaveBeenNthCalledWith(4, 'three');
    expect(concatNextSpy).toHaveBeenNthCalledWith(5, true);

    subscription.unsubscribe();
    expect(numberSpiedObservable.spies.tearDown).toHaveBeenCalled();
    expect(stringSpiedObservable.spies.tearDown).toHaveBeenCalled();
    expect(booleanSpiedObservable.spies.tearDown).toHaveBeenCalled();
  });

  test.skip('should create an observable which does not emit anymore if some of the sources fail', () => {
    const numberSpiedObservable = newObservableWithSpies<number>();
    const stringSpiedObservable = newObservableWithSpies<string>();
    const booleanSpiedObservable = newObservableWithSpies<boolean>();

    const concatenated = concat(
      numberSpiedObservable.observable,
      stringSpiedObservable.observable,
      booleanSpiedObservable.observable,
    );

    const concatNextSpy = jest.fn();
    const concatErrorSpy = jest.fn();
    const concatCompleteSpy = jest.fn();
    const subscription = concatenated.subscribe({
      next: concatNextSpy,
      error: concatErrorSpy,
      complete: concatCompleteSpy,
    });

    numberSpiedObservable.triggers.next?.(1);
    stringSpiedObservable.triggers.next?.('one');
    booleanSpiedObservable.triggers.next?.(true);
    numberSpiedObservable.triggers.next?.(2);
    stringSpiedObservable.triggers.next?.('two');
    numberSpiedObservable.triggers.error?.(new Error('some error'));
    booleanSpiedObservable.triggers.next?.(false);

    expect(concatNextSpy).toHaveBeenNthCalledWith(1, 1);
    expect(concatNextSpy).toHaveBeenNthCalledWith(2, 'one');
    expect(concatNextSpy).toHaveBeenNthCalledWith(3, true);
    expect(concatNextSpy).toHaveBeenNthCalledWith(4, 2);
    expect(concatNextSpy).toHaveBeenNthCalledWith(5, 'two');
    expect(concatNextSpy).toHaveBeenCalledTimes(5);
    expect(concatErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'some error',
      }),
    );

    subscription.unsubscribe();
    expect(numberSpiedObservable.spies.tearDown).toHaveBeenCalled();
    expect(stringSpiedObservable.spies.tearDown).toHaveBeenCalled();
    expect(booleanSpiedObservable.spies.tearDown).toHaveBeenCalled();
  });

  test.skip('should create an observable which does complete until all sources complete', () => {
    const numberSpiedObservable = newObservableWithSpies<number>();
    const stringSpiedObservable = newObservableWithSpies<string>();
    const booleanSpiedObservable = newObservableWithSpies<boolean>();

    const concatenated = concat(
      numberSpiedObservable.observable,
      stringSpiedObservable.observable,
      booleanSpiedObservable.observable,
    );

    const concatNextSpy = jest.fn();
    const concatErrorSpy = jest.fn();
    const concatCompleteSpy = jest.fn();
    const subscription = concatenated.subscribe({
      next: concatNextSpy,
      error: concatErrorSpy,
      complete: concatCompleteSpy,
    });

    numberSpiedObservable.triggers.next?.(1);
    stringSpiedObservable.triggers.next?.('one');
    booleanSpiedObservable.triggers.next?.(true);
    numberSpiedObservable.triggers.next?.(2);
    stringSpiedObservable.triggers.next?.('two');

    numberSpiedObservable.triggers.complete?.();
    stringSpiedObservable.triggers.complete?.();
    expect(concatCompleteSpy).not.toHaveBeenCalled();

    booleanSpiedObservable.triggers.next?.(false);
    booleanSpiedObservable.triggers.next?.(true);

    expect(concatNextSpy).toHaveBeenNthCalledWith(1, 1);
    expect(concatNextSpy).toHaveBeenNthCalledWith(2, 'one');
    expect(concatNextSpy).toHaveBeenNthCalledWith(3, true);
    expect(concatNextSpy).toHaveBeenNthCalledWith(4, 2);
    expect(concatNextSpy).toHaveBeenNthCalledWith(5, 'two');
    expect(concatNextSpy).toHaveBeenNthCalledWith(6, false);
    expect(concatNextSpy).toHaveBeenNthCalledWith(7, true);

    booleanSpiedObservable.triggers.complete?.();
    expect(concatCompleteSpy).toHaveBeenCalled();

    subscription.unsubscribe();
    expect(numberSpiedObservable.spies.tearDown).toHaveBeenCalled();
    expect(stringSpiedObservable.spies.tearDown).toHaveBeenCalled();
    expect(booleanSpiedObservable.spies.tearDown).toHaveBeenCalled();
  });
});
