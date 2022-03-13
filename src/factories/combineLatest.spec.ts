import { combineLatest } from './combineLatest';
import { newObservableWithSpies } from '../__test__';

describe('combineLatest factory', () => {
  test('should create an observable which emits last values from all other observables', () => {
    const numberSpiedObservable = newObservableWithSpies<number>();
    const stringSpiedObservable = newObservableWithSpies<string>();
    const booleanSpiedObservable = newObservableWithSpies<boolean>();

    const combined = combineLatest(
      numberSpiedObservable.observable,
      stringSpiedObservable.observable,
      booleanSpiedObservable.observable,
    );

    const combineNextSpy = jest.fn();
    const combineErrorSpy = jest.fn();
    const combineCompleteSpy = jest.fn();
    const subscription = combined.subscribe({
      next: combineNextSpy,
      error: combineErrorSpy,
      complete: combineCompleteSpy,
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

    expect(combineNextSpy).toHaveBeenNthCalledWith(1, [1, 'one', true]);
    expect(combineNextSpy).toHaveBeenNthCalledWith(2, [2, 'one', true]);
    expect(combineNextSpy).toHaveBeenNthCalledWith(3, [2, 'two', true]);
    expect(combineNextSpy).toHaveBeenNthCalledWith(4, [2, 'two', false]);
    expect(combineNextSpy).toHaveBeenNthCalledWith(5, [3, 'two', false]);
    expect(combineNextSpy).toHaveBeenNthCalledWith(6, [3, 'three', false]);
    expect(combineNextSpy).toHaveBeenNthCalledWith(7, [3, 'three', true]);

    subscription.unsubscribe();
    expect(numberSpiedObservable.spies.tearDown).toHaveBeenCalled();
    expect(stringSpiedObservable.spies.tearDown).toHaveBeenCalled();
    expect(booleanSpiedObservable.spies.tearDown).toHaveBeenCalled();
  });

  test('should create an observable which does not emit anymore if some of the sources fail', () => {
    const numberSpiedObservable = newObservableWithSpies<number>();
    const stringSpiedObservable = newObservableWithSpies<string>();
    const booleanSpiedObservable = newObservableWithSpies<boolean>();

    const combined = combineLatest(
      numberSpiedObservable.observable,
      stringSpiedObservable.observable,
      booleanSpiedObservable.observable,
    );

    const combineNextSpy = jest.fn();
    const combineErrorSpy = jest.fn();
    const combineCompleteSpy = jest.fn();
    const subscription = combined.subscribe({
      next: combineNextSpy,
      error: combineErrorSpy,
      complete: combineCompleteSpy,
    });

    numberSpiedObservable.triggers.next?.(1);
    stringSpiedObservable.triggers.next?.('one');
    booleanSpiedObservable.triggers.next?.(true);
    numberSpiedObservable.triggers.next?.(2);
    stringSpiedObservable.triggers.next?.('two');
    numberSpiedObservable.triggers.error?.(new Error('some error'));
    booleanSpiedObservable.triggers.next?.(false);

    expect(combineNextSpy).toHaveBeenNthCalledWith(1, [1, 'one', true]);
    expect(combineNextSpy).toHaveBeenNthCalledWith(2, [2, 'one', true]);
    expect(combineNextSpy).toHaveBeenNthCalledWith(3, [2, 'two', true]);
    expect(combineNextSpy).toHaveBeenCalledTimes(3);
    expect(combineErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'some error',
      }),
    );

    subscription.unsubscribe();
    expect(numberSpiedObservable.spies.tearDown).toHaveBeenCalled();
    expect(stringSpiedObservable.spies.tearDown).toHaveBeenCalled();
    expect(booleanSpiedObservable.spies.tearDown).toHaveBeenCalled();
  });

  test('should create an observable which does not complete until all sources complete', () => {
    const numberSpiedObservable = newObservableWithSpies<number>();
    const stringSpiedObservable = newObservableWithSpies<string>();
    const booleanSpiedObservable = newObservableWithSpies<boolean>();

    const combined = combineLatest(
      numberSpiedObservable.observable,
      stringSpiedObservable.observable,
      booleanSpiedObservable.observable,
    );

    const combineNextSpy = jest.fn();
    const combineErrorSpy = jest.fn();
    const combineCompleteSpy = jest.fn();
    const subscription = combined.subscribe({
      next: combineNextSpy,
      error: combineErrorSpy,
      complete: combineCompleteSpy,
    });

    numberSpiedObservable.triggers.next?.(1);
    stringSpiedObservable.triggers.next?.('one');
    booleanSpiedObservable.triggers.next?.(true);
    numberSpiedObservable.triggers.next?.(2);
    stringSpiedObservable.triggers.next?.('two');

    numberSpiedObservable.triggers.complete?.();
    stringSpiedObservable.triggers.complete?.();
    expect(combineCompleteSpy).not.toHaveBeenCalled();

    booleanSpiedObservable.triggers.next?.(false);
    booleanSpiedObservable.triggers.next?.(true);

    expect(combineNextSpy).toHaveBeenNthCalledWith(1, [1, 'one', true]);
    expect(combineNextSpy).toHaveBeenNthCalledWith(2, [2, 'one', true]);
    expect(combineNextSpy).toHaveBeenNthCalledWith(3, [2, 'two', true]);
    expect(combineNextSpy).toHaveBeenNthCalledWith(4, [2, 'two', false]);
    expect(combineNextSpy).toHaveBeenNthCalledWith(5, [2, 'two', true]);

    // expect(mergeNextSpy).toHaveBeenNthCalledWith(1, 1);
    // expect(mergeNextSpy).toHaveBeenNthCalledWith(2, 'one');
    // expect(mergeNextSpy).toHaveBeenNthCalledWith(3, true);
    // expect(mergeNextSpy).toHaveBeenNthCalledWith(4, 2);
    // expect(mergeNextSpy).toHaveBeenNthCalledWith(5, 'two');
    // expect(mergeNextSpy).toHaveBeenNthCalledWith(6, false);
    // expect(mergeNextSpy).toHaveBeenNthCalledWith(7, true);

    booleanSpiedObservable.triggers.complete?.();
    expect(combineCompleteSpy).toHaveBeenCalled();

    subscription.unsubscribe();
    expect(numberSpiedObservable.spies.tearDown).toHaveBeenCalled();
    expect(stringSpiedObservable.spies.tearDown).toHaveBeenCalled();
    expect(booleanSpiedObservable.spies.tearDown).toHaveBeenCalled();
  });
});
