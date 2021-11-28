import { Observable } from '../observable';
import { Observer } from '../types';
import { takeWhile } from './takeWhile';

describe('takeWhile operator', () => {
  let nextTrigger: (num: number) => void;
  let errorTrigger: (err: any) => void;
  let completeTrigger: () => void;
  const tearDownSpy = jest.fn();
  const sourceNumbers = new Observable<number>((observer: Observer<number>) => {
    nextTrigger = (num: number) => {
      return observer.next(num);
    };
    errorTrigger = (err: any) => {
      return observer.error(err);
    };
    completeTrigger = () => {
      return observer.complete();
    };

    return tearDownSpy;
  });
  const newSpyObserver = () => {
    return {
      next: jest.fn(),
      error: jest.fn(),
      complete: jest.fn(),
    };
  };
  // eslint-disable-next-line arrow-body-style
  const lowSquares = takeWhile<number>((value, index) => Math.pow(value, 2) < 100);
  const squaresBelowhundred = lowSquares(sourceNumbers);

  describe('upon emitted value in the source observable', () => {
    test('should emit values if they pass the predicate', () => {
      const spyObserver = newSpyObserver();
      const subscription = squaresBelowhundred.subscribe(spyObserver);

      nextTrigger(1);
      nextTrigger(2);
      nextTrigger(3);
      nextTrigger(4);
      completeTrigger();
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledWith(1);
      expect(spyObserver.next).toHaveBeenCalledWith(2);
      expect(spyObserver.next).toHaveBeenCalledTimes(4);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).toHaveBeenCalled();
      expect(tearDownSpy).toHaveBeenCalled();
    });

    test('should emit values until the predicate fails', () => {
      const spyObserver = newSpyObserver();
      const subscription = squaresBelowhundred.subscribe(spyObserver);
      const values = [...new Array(10)].map((v, i) => i + 1);

      values.forEach(nextTrigger);
      subscription.unsubscribe();

      values
        .filter((v) => v !== 10)
        .forEach((v) => {
          expect(spyObserver.next).toHaveBeenCalledWith(v);
        });
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).toHaveBeenCalled();
      expect(tearDownSpy).toHaveBeenCalled();
    });

    test('should emit values until the predicate fails including the last one', () => {
      const lowSquaresIncluding = takeWhile<number>((value, index) => Math.pow(value, 2) < 100, true);
      const squaresBelowhundredIncluding = lowSquaresIncluding(sourceNumbers);
      const spyObserver = newSpyObserver();
      const subscription = squaresBelowhundredIncluding.subscribe(spyObserver);
      const values = [...new Array(10)].map((v, i) => i + 1);

      values.forEach(nextTrigger);
      subscription.unsubscribe();

      values.forEach((v) => {
        expect(spyObserver.next).toHaveBeenCalledWith(v);
      });
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).toHaveBeenCalled();
      expect(tearDownSpy).toHaveBeenCalled();
    });
  });

  describe('upon error in the source observable', () => {
    test('should error if occurs before picking all the values', () => {
      const spyObserver = newSpyObserver();
      const subscription = squaresBelowhundred.subscribe(spyObserver);

      nextTrigger(1);
      errorTrigger(new Error('observer error'));
      nextTrigger(2);
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledWith(1);
      expect(spyObserver.next).toHaveBeenCalledTimes(1);
      expect(spyObserver.error).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'observer error',
        }),
      );
      expect(spyObserver.complete).not.toHaveBeenCalled();
      expect(tearDownSpy).toHaveBeenCalled();
    });

    test('should complete if occurs after picking all the values', () => {
      const spyObserver = newSpyObserver();
      const subscription = squaresBelowhundred.subscribe(spyObserver);

      nextTrigger(1);
      nextTrigger(2);
      nextTrigger(3);
      errorTrigger(new Error('observer error'));
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledWith(1);
      expect(spyObserver.next).toHaveBeenCalledWith(2);
      expect(spyObserver.next).toHaveBeenCalledWith(3);
      expect(spyObserver.next).toHaveBeenCalledTimes(3);
      expect(spyObserver.error).toHaveBeenCalled();
      expect(spyObserver.complete).not.toHaveBeenCalled();
      expect(tearDownSpy).toHaveBeenCalled();
    });
  });

  describe('upon complete in the source observable', () => {
    test('should complete before emitting any value', () => {
      const spyObserver = newSpyObserver();
      const subscription = squaresBelowhundred.subscribe(spyObserver);

      completeTrigger();
      nextTrigger(1);
      nextTrigger(2);
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledTimes(0);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).toHaveBeenCalled();
      expect(tearDownSpy).toHaveBeenCalled();
    });

    test('should complete if the source observable completes', () => {
      const spyObserver = newSpyObserver();
      const subscription = squaresBelowhundred.subscribe(spyObserver);

      nextTrigger(1);
      nextTrigger(2);
      completeTrigger();
      nextTrigger(3);
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledTimes(2);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).toHaveBeenCalled();
      expect(tearDownSpy).toHaveBeenCalled();
    });
  });
});
