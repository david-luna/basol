/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Observable } from '../observable';
import { OperatorFunction } from '../types';
import { newObservableWithSpies, newSpyObserver, ObservableWithSpies } from '../__test__';
import { withLatestFrom } from './withLatestFrom';

interface IValue {
  val: number;
}

describe('withLatestFrom operator', () => {
  let numbers: ObservableWithSpies<number>;
  let strings: ObservableWithSpies<string>;
  let booleans: ObservableWithSpies<boolean>;
  let source: ObservableWithSpies<IValue>;

  let operator: OperatorFunction<IValue, [IValue, number, string, boolean]>;
  let observable: Observable<[IValue, number, string, boolean]>;

  beforeEach(() => {
    numbers = newObservableWithSpies();
    strings = newObservableWithSpies();
    booleans = newObservableWithSpies();
    source = newObservableWithSpies();

    operator = withLatestFrom(numbers.observable, strings.observable, booleans.observable);
    observable = operator(source.observable);
  });

  describe('upon emitted value in the source observable', () => {
    test('should emit nothing if not all observables have emitted', () => {
      const spyObserver = newSpyObserver();
      const subscription = observable.subscribe(spyObserver);

      numbers.triggers.next!(1);
      strings.triggers.next!('one');
      source.triggers.next!({ val: 0 });

      subscription.unsubscribe();

      expect(spyObserver.next).not.toHaveBeenCalled();
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).not.toHaveBeenCalled();
      expect(source.spies.tearDown).toHaveBeenCalled();
    });

    test('should emit if all observables have emitted', () => {
      const spyObserver = newSpyObserver();
      const subscription = observable.subscribe(spyObserver);

      numbers.triggers.next!(1);
      strings.triggers.next!('one');
      booleans.triggers.next!(true);
      source.triggers.next!({ val: 0 });

      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledWith([{ val: 0 }, 1, 'one', true]);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).not.toHaveBeenCalled();
      expect(source.spies.tearDown).toHaveBeenCalled();
    });

    test('should emit last value of the completed observables', () => {
      const spyObserver = newSpyObserver();
      const subscription = observable.subscribe(spyObserver);

      numbers.triggers.next!(1);
      strings.triggers.next!('one');
      strings.triggers.complete!();
      booleans.triggers.next!(true);
      booleans.triggers.complete!();
      source.triggers.next!({ val: 1 });

      expect(spyObserver.next).toHaveBeenCalledWith([{ val: 1 }, 1, 'one', true]);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).not.toHaveBeenCalled();

      numbers.triggers.next!(2);
      numbers.triggers.complete!();
      source.triggers.next!({ val: 2 });

      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledWith([{ val: 2 }, 2, 'one', true]);
      expect(source.spies.tearDown).toHaveBeenCalled();
    });
  });

  describe('upon emitted error in the source observable', () => {
    test('should emit error if the source observable errored', () => {
      const spyObserver = newSpyObserver();
      const subscription = observable.subscribe(spyObserver);

      numbers.triggers.next!(1);
      strings.triggers.next!('one');
      booleans.triggers.next!(true);
      booleans.triggers.complete!();
      source.triggers.error!('some error');

      expect(spyObserver.next).not.toHaveBeenCalled();
      expect(spyObserver.error).toHaveBeenCalledWith('some error');
      expect(spyObserver.complete).not.toHaveBeenCalled();

      numbers.triggers.next!(2);
      numbers.triggers.complete!();
      source.triggers.next!({ val: 2 });

      subscription.unsubscribe();

      expect(spyObserver.next).not.toHaveBeenCalled();
      expect(spyObserver.complete).not.toHaveBeenCalled();
      expect(source.spies.tearDown).toHaveBeenCalled();
    });

    test('should emit error if one of the other observables errored', () => {
      const spyObserver = newSpyObserver();
      const subscription = observable.subscribe(spyObserver);

      numbers.triggers.next!(1);
      strings.triggers.next!('one');
      strings.triggers.error!('some error');
      booleans.triggers.next!(true);
      booleans.triggers.complete!();
      source.triggers.next!({ val: 1 });

      expect(spyObserver.next).not.toHaveBeenCalled();
      expect(spyObserver.error).toHaveBeenCalledWith('some error');
      expect(spyObserver.complete).not.toHaveBeenCalled();

      numbers.triggers.next!(2);
      numbers.triggers.complete!();
      source.triggers.next!({ val: 2 });

      subscription.unsubscribe();

      expect(spyObserver.next).not.toHaveBeenCalled();
      expect(spyObserver.complete).not.toHaveBeenCalled();
      expect(source.spies.tearDown).toHaveBeenCalled();
    });
  });

  describe('upon complete in the source observable', () => {
    it('should complete the resulting observable', () => {
      const spyObserver = newSpyObserver();
      const subscription = observable.subscribe(spyObserver);

      numbers.triggers.next!(1);
      strings.triggers.next!('one');
      booleans.triggers.next!(true);
      source.triggers.next!({ val: 0 });
      source.triggers.complete!();

      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledWith([{ val: 0 }, 1, 'one', true]);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).toHaveBeenCalled();
      expect(source.spies.tearDown).toHaveBeenCalled();
    });

    it('should not emit anymore when other observables emit', () => {
      const spyObserver = newSpyObserver();
      const subscription = observable.subscribe(spyObserver);

      numbers.triggers.next!(1);
      strings.triggers.next!('one');
      booleans.triggers.next!(true);
      source.triggers.next!({ val: 0 });
      source.triggers.complete!();
      numbers.triggers.next!(2);
      strings.triggers.next!('two');
      booleans.triggers.next!(false);

      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledWith([{ val: 0 }, 1, 'one', true]);
      expect(spyObserver.next).toHaveBeenCalledTimes(1);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).toHaveBeenCalled();
      expect(source.spies.tearDown).toHaveBeenCalled();
    });
  });

  describe('upon unsubscription of the resulting observable', () => {
    it('should tear down the source and all other subscriptions', () => {
      const spyObserver = newSpyObserver();
      const subscription = observable.subscribe(spyObserver);

      numbers.triggers.next!(1);
      strings.triggers.next!('one');
      booleans.triggers.next!(true);
      source.triggers.next!({ val: 0 });
      source.triggers.complete!();

      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledWith([{ val: 0 }, 1, 'one', true]);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).toHaveBeenCalled();
      expect(source.spies.tearDown).toHaveBeenCalled();
      expect(numbers.spies.tearDown).toHaveBeenCalled();
      expect(strings.spies.tearDown).toHaveBeenCalled();
      expect(booleans.spies.tearDown).toHaveBeenCalled();
    });

    it('should tear down all other subscriptions if we did not subscribe from the source', () => {
      const spyObserver = newSpyObserver();
      const subscription = observable.subscribe(spyObserver);

      numbers.triggers.next!(1);
      strings.triggers.next!('one');
      booleans.triggers.next!(true);
      source.triggers.next!({ val: 0 });
      source.triggers.complete!();

      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledWith([{ val: 0 }, 1, 'one', true]);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).toHaveBeenCalled();
      expect(source.spies.tearDown).toHaveBeenCalled();
      expect(numbers.spies.tearDown).toHaveBeenCalled();
      expect(strings.spies.tearDown).toHaveBeenCalled();
      expect(booleans.spies.tearDown).toHaveBeenCalled();
    });
  });
});
