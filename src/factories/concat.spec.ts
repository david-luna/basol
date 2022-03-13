import { concat } from './concat';
import { newObservableWithSpies } from '../__test__';

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

    expect(concatNextSpy).toHaveBeenNthCalledWith(1, 1);
    expect(concatNextSpy).toHaveBeenNthCalledWith(2, 2);
    expect(concatNextSpy).toHaveBeenNthCalledWith(3, 3);
    expect(concatNextSpy).toHaveBeenNthCalledWith(4, 'three');
    expect(concatNextSpy).toHaveBeenNthCalledWith(5, true);
    expect(concatErrorSpy).not.toHaveBeenCalled();
    expect(concatCompleteSpy).not.toHaveBeenCalled();

    subscription.unsubscribe();
    expect(numberSpiedObservable.spies.tearDown).toHaveBeenCalled();
    expect(stringSpiedObservable.spies.tearDown).toHaveBeenCalled();
    expect(booleanSpiedObservable.spies.tearDown).toHaveBeenCalled();
  });

  test('should create an observable which does not emit anymore if some of the sources fail', () => {
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
    numberSpiedObservable.triggers.next?.(2);
    numberSpiedObservable.triggers.complete?.();
    stringSpiedObservable.triggers.next?.('one');
    booleanSpiedObservable.triggers.next?.(true);
    stringSpiedObservable.triggers.next?.('two');
    stringSpiedObservable.triggers.error?.(new Error('some error'));
    booleanSpiedObservable.triggers.next?.(false);

    expect(concatNextSpy).toHaveBeenNthCalledWith(1, 1);
    expect(concatNextSpy).toHaveBeenNthCalledWith(2, 2);
    expect(concatNextSpy).toHaveBeenNthCalledWith(3, 'one');
    expect(concatNextSpy).toHaveBeenNthCalledWith(4, 'two');
    expect(concatNextSpy).toHaveBeenCalledTimes(4);
    expect(concatErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'some error',
      }),
    );
    expect(concatErrorSpy).toHaveBeenCalled();

    subscription.unsubscribe();
    expect(numberSpiedObservable.spies.tearDown).toHaveBeenCalled();
    expect(stringSpiedObservable.spies.tearDown).toHaveBeenCalled();
    expect(booleanSpiedObservable.spies.tearDown).not.toHaveBeenCalled();
  });

  test('should create an observable which does complete until all sources complete', () => {
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
    expect(concatErrorSpy).not.toHaveBeenCalled();
    expect(concatCompleteSpy).toHaveBeenCalled();

    subscription.unsubscribe();
    expect(numberSpiedObservable.spies.tearDown).toHaveBeenCalled();
    expect(stringSpiedObservable.spies.tearDown).toHaveBeenCalled();
    expect(booleanSpiedObservable.spies.tearDown).toHaveBeenCalled();
  });  
});
