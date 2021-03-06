/* eslint-disable @typescript-eslint/no-magic-numbers */
import { merge } from './merge';
import { newObservableWithSpies } from '../__test__';

describe('merge factory', () => {
  test('should create an observable which emits values from all other observables', () => {
    const numberSpiedObservable = newObservableWithSpies<number>();
    const stringSpiedObservable = newObservableWithSpies<string>();
    const booleanSpiedObservable = newObservableWithSpies<boolean>();

    const merged = merge(
      numberSpiedObservable.observable,
      stringSpiedObservable.observable,
      booleanSpiedObservable.observable,
    );

    const mergeNextSpy = jest.fn();
    const mergeErrorSpy = jest.fn();
    const mergeCompleteSpy = jest.fn();
    const subscription = merged.subscribe({
      next: mergeNextSpy,
      error: mergeErrorSpy,
      complete: mergeCompleteSpy,
    });

    numberSpiedObservable.triggers.next?.(1);
    stringSpiedObservable.triggers.next?.('one');
    booleanSpiedObservable.triggers.next?.(true);
    numberSpiedObservable.triggers.next?.(2);
    stringSpiedObservable.triggers.next?.('two');
    booleanSpiedObservable.triggers.next?.(false);
    numberSpiedObservable.triggers.next?.(3);
    stringSpiedObservable.triggers.next?.('three');
    booleanSpiedObservable.triggers.next?.(true);

    expect(mergeNextSpy).toHaveBeenNthCalledWith(1, 1);
    expect(mergeNextSpy).toHaveBeenNthCalledWith(2, 'one');
    expect(mergeNextSpy).toHaveBeenNthCalledWith(3, true);
    expect(mergeNextSpy).toHaveBeenNthCalledWith(4, 2);
    expect(mergeNextSpy).toHaveBeenNthCalledWith(5, 'two');
    expect(mergeNextSpy).toHaveBeenNthCalledWith(6, false);
    expect(mergeNextSpy).toHaveBeenNthCalledWith(7, 3);
    expect(mergeNextSpy).toHaveBeenNthCalledWith(8, 'three');
    expect(mergeNextSpy).toHaveBeenNthCalledWith(9, true);

    subscription.unsubscribe();
    expect(numberSpiedObservable.spies.tearDown).toHaveBeenCalled();
    expect(stringSpiedObservable.spies.tearDown).toHaveBeenCalled();
    expect(booleanSpiedObservable.spies.tearDown).toHaveBeenCalled();
  });

  test('should create an observable which does not emit anymore if some of the sources fail', () => {
    const numberSpiedObservable = newObservableWithSpies<number>();
    const stringSpiedObservable = newObservableWithSpies<string>();
    const booleanSpiedObservable = newObservableWithSpies<boolean>();

    const merged = merge(
      numberSpiedObservable.observable,
      stringSpiedObservable.observable,
      booleanSpiedObservable.observable,
    );

    const mergeNextSpy = jest.fn();
    const mergeErrorSpy = jest.fn();
    const mergeCompleteSpy = jest.fn();
    const subscription = merged.subscribe({
      next: mergeNextSpy,
      error: mergeErrorSpy,
      complete: mergeCompleteSpy,
    });

    numberSpiedObservable.triggers.next?.(1);
    stringSpiedObservable.triggers.next?.('one');
    booleanSpiedObservable.triggers.next?.(true);
    numberSpiedObservable.triggers.next?.(2);
    stringSpiedObservable.triggers.next?.('two');
    numberSpiedObservable.triggers.error?.(new Error('some error'));
    booleanSpiedObservable.triggers.next?.(false);

    expect(mergeNextSpy).toHaveBeenNthCalledWith(1, 1);
    expect(mergeNextSpy).toHaveBeenNthCalledWith(2, 'one');
    expect(mergeNextSpy).toHaveBeenNthCalledWith(3, true);
    expect(mergeNextSpy).toHaveBeenNthCalledWith(4, 2);
    expect(mergeNextSpy).toHaveBeenNthCalledWith(5, 'two');
    expect(mergeNextSpy).toHaveBeenCalledTimes(5);
    expect(mergeErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'some error',
      }),
    );

    subscription.unsubscribe();
    expect(numberSpiedObservable.spies.tearDown).toHaveBeenCalled();
    expect(stringSpiedObservable.spies.tearDown).toHaveBeenCalled();
    expect(booleanSpiedObservable.spies.tearDown).toHaveBeenCalled();
  });

  test('should create an observable which does complete until all sources complete', () => {
    const numberSpiedObservable = newObservableWithSpies<number>();
    const stringSpiedObservable = newObservableWithSpies<string>();
    const booleanSpiedObservable = newObservableWithSpies<boolean>();

    const merged = merge(
      numberSpiedObservable.observable,
      stringSpiedObservable.observable,
      booleanSpiedObservable.observable,
    );

    const mergeNextSpy = jest.fn();
    const mergeErrorSpy = jest.fn();
    const mergeCompleteSpy = jest.fn();
    const subscription = merged.subscribe({
      next: mergeNextSpy,
      error: mergeErrorSpy,
      complete: mergeCompleteSpy,
    });

    numberSpiedObservable.triggers.next?.(1);
    stringSpiedObservable.triggers.next?.('one');
    booleanSpiedObservable.triggers.next?.(true);
    numberSpiedObservable.triggers.next?.(2);
    stringSpiedObservable.triggers.next?.('two');

    numberSpiedObservable.triggers.complete?.();
    stringSpiedObservable.triggers.complete?.();
    expect(mergeCompleteSpy).not.toHaveBeenCalled();

    booleanSpiedObservable.triggers.next?.(false);
    booleanSpiedObservable.triggers.next?.(true);

    expect(mergeNextSpy).toHaveBeenNthCalledWith(1, 1);
    expect(mergeNextSpy).toHaveBeenNthCalledWith(2, 'one');
    expect(mergeNextSpy).toHaveBeenNthCalledWith(3, true);
    expect(mergeNextSpy).toHaveBeenNthCalledWith(4, 2);
    expect(mergeNextSpy).toHaveBeenNthCalledWith(5, 'two');
    expect(mergeNextSpy).toHaveBeenNthCalledWith(6, false);
    expect(mergeNextSpy).toHaveBeenNthCalledWith(7, true);

    booleanSpiedObservable.triggers.complete?.();
    expect(mergeCompleteSpy).toHaveBeenCalled();

    subscription.unsubscribe();
    expect(numberSpiedObservable.spies.tearDown).toHaveBeenCalled();
    expect(stringSpiedObservable.spies.tearDown).toHaveBeenCalled();
    expect(booleanSpiedObservable.spies.tearDown).toHaveBeenCalled();
  });
});
