/* eslint-disable @typescript-eslint/no-magic-numbers */
import { mergeMap } from './mergeMap';
import { newObservableWithSpies, newSpyObserver, ObservableWithSpies } from '../__test__';

describe('mergeMap operator', () => {
  let sourceNumbers: ObservableWithSpies<number>;
  const observablesArray: ObservableWithSpies<number>[] = [];
  const valuesToEmit = Array.from(Array(20)).map(() => Math.random());
  const toMerge = mergeMap((i: number) => observablesArray[i].observable);

  beforeEach(() => {
    sourceNumbers = newObservableWithSpies<number>();
    observablesArray.push(
      newObservableWithSpies<number>(),
      newObservableWithSpies<number>(),
      newObservableWithSpies<number>(),
    );
  });

  afterEach(() => {
    observablesArray.length = 0;
    jest.resetAllMocks();
  });

  describe('upon emitted value in the source observable', () => {
    test('should emit values from the projected observable merged to the result observable', () => {
      const resultObservable = toMerge(sourceNumbers.observable);
      const spyObserver = newSpyObserver();
      const subscription = resultObservable.subscribe(spyObserver);

      sourceNumbers.triggers.next?.(0);
      sourceNumbers.triggers.next?.(1);
      sourceNumbers.triggers.next?.(2);

      // emit values from one of the inner observables randomly
      valuesToEmit.forEach((value) => {
        const observableIndex = Math.floor(Math.random() * 1000) % 3;
        const observable = observablesArray[observableIndex];

        observable.triggers.next?.(value);
      });
      subscription.unsubscribe();

      // the merged observable should emit values in the same order
      valuesToEmit.forEach((value, index) => {
        expect(spyObserver.next).toHaveBeenNthCalledWith(index + 1, value);
      });
      expect(spyObserver.next).toHaveBeenCalledTimes(valuesToEmit.length);

      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).not.toHaveBeenCalled();
      expect(sourceNumbers.spies.tearDown).toHaveBeenCalled();
      observablesArray.forEach((obs) => {
        expect(obs.spies.tearDown).toHaveBeenCalled();
      });
    });

    test('should emit error if one of the projected obserbavles do', () => {
      const resultObservable = toMerge(sourceNumbers.observable);
      const spyObserver = newSpyObserver();
      const subscription = resultObservable.subscribe(spyObserver);
      const errorIndex = Math.max(1, Math.floor(Math.random() * valuesToEmit.length));

      sourceNumbers.triggers.next?.(0);
      sourceNumbers.triggers.next?.(1);
      sourceNumbers.triggers.next?.(2);

      // emit values from one of the inner observables randomly
      valuesToEmit.forEach((value, index) => {
        const observableIndex = Math.floor(Math.random() * 1000) % 3;
        const observable = observablesArray[observableIndex];

        if (index === errorIndex) {
          observable.triggers.error?.(new Error('explosion in projected observable'));
        } else {
          observable.triggers.next?.(value);
        }
      });
      subscription.unsubscribe();

      // the merged observable should emit values in the same order
      for (let index = 0; index < errorIndex; index++) {
        expect(spyObserver.next).toHaveBeenNthCalledWith(index + 1, valuesToEmit[index]);
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(spyObserver.next).toHaveBeenCalledTimes(errorIndex);

      expect(spyObserver.error).toHaveBeenCalled();
      expect(spyObserver.complete).not.toHaveBeenCalled();
      expect(sourceNumbers.spies.tearDown).toHaveBeenCalled();
      observablesArray.forEach((obs) => {
        expect(obs.spies.tearDown).toHaveBeenCalled();
      });
    });

    test('should emit complete if ALL of the projected obserbavles do', () => {
      const resultObservable = toMerge(sourceNumbers.observable);
      const spyObserver = newSpyObserver();
      resultObservable.subscribe(spyObserver);

      sourceNumbers.triggers.next?.(0);
      sourceNumbers.triggers.next?.(1);
      sourceNumbers.triggers.next?.(2);

      // emit values from one of the inner observables randomly
      valuesToEmit.forEach((value) => {
        const observableIndex = Math.floor(Math.random() * 1000) % 3;
        const observable = observablesArray[observableIndex];

        observable.triggers.next?.(value);
      });

      // the merged observable should emit values in the same order
      valuesToEmit.forEach((value, index) => {
        expect(spyObserver.next).toHaveBeenNthCalledWith(index + 1, value);
      });
      observablesArray.forEach((obs) => obs.triggers.complete?.());

      expect(spyObserver.next).toHaveBeenCalledTimes(valuesToEmit.length);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).toHaveBeenCalled();
      expect(sourceNumbers.spies.tearDown).not.toHaveBeenCalled();
      observablesArray.forEach((obs) => {
        expect(obs.spies.tearDown).not.toHaveBeenCalled();
      });
    });
  });

  describe('upon emitted error in the source observable', () => {
    test('should emit error and not emit any of the values of the projected observables', () => {
      const resultObservable = toMerge(sourceNumbers.observable);
      const spyObserver = newSpyObserver();
      const subscription = resultObservable.subscribe(spyObserver);
      const errorIndex = Math.max(1, Math.floor(Math.random() * valuesToEmit.length));

      sourceNumbers.triggers.next?.(0);
      sourceNumbers.triggers.next?.(1);
      sourceNumbers.triggers.next?.(2);

      // emit values from one of the inner observables randomly
      valuesToEmit.forEach((value, index) => {
        const observableIndex = Math.floor(Math.random() * 1000) % 3;
        const observable = observablesArray[observableIndex];

        if (index === errorIndex) {
          sourceNumbers.triggers.error?.(new Error('explosion in source observable'));
        }
        observable.triggers.next?.(value);
      });
      subscription.unsubscribe();

      // the merged observable should emit values in the same order
      for (let index = 0; index < errorIndex; index++) {
        expect(spyObserver.next).toHaveBeenNthCalledWith(index + 1, valuesToEmit[index]);
      }
      expect(spyObserver.next).toHaveBeenCalledTimes(errorIndex);

      expect(spyObserver.error).toHaveBeenCalled();
      expect(spyObserver.complete).not.toHaveBeenCalled();
      expect(sourceNumbers.spies.tearDown).toHaveBeenCalled();
      observablesArray.forEach((obs) => {
        expect(obs.spies.tearDown).toHaveBeenCalled();
      });
    });
  });
});
