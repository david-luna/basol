import { Observer, Subscription } from "./types";
import { Observable } from "./observable";

interface ObserverSpy {
  next: jest.SpyInstance;
  error: jest.SpyInstance;
  complete: jest.SpyInstance;
}

describe("Observable", () => {
  let nextTrigger: (num: number) => void;
  let errorTrigger: (err: any) => void;
  let completeTrigger: () => void;
  let observable: Observable<number>;
  const tearDownSpy = jest.fn();
  const newSpyObserver = () => {
    return {
      next: jest.fn(),
      error: jest.fn(),
      complete: jest.fn()
    };
  };

  beforeEach(() => {
    observable = new Observable<number>((observer) => {
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
  });

  describe("upon call to observer.next", () => {
    test("should emit a value without error nor completion", () => {
      const spyObserver = newSpyObserver();
      const subscription = observable.subscribe(spyObserver);

      nextTrigger(1);
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenCalledWith(1);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).not.toHaveBeenCalled();
      expect(tearDownSpy).toHaveBeenCalled();
    });

    test("should allow to emit more than one value", () => {
      const spyObserver = newSpyObserver();
      const subscription = observable.subscribe(spyObserver);

      nextTrigger(1);
      nextTrigger(2);
      nextTrigger(3);
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenNthCalledWith(1, 1);
      expect(spyObserver.next).toHaveBeenNthCalledWith(2, 2);
      expect(spyObserver.next).toHaveBeenNthCalledWith(3, 3);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).not.toHaveBeenCalled();
      expect(tearDownSpy).toHaveBeenCalled();
    });
  });


  describe("upon call to observer.error", () => {
    test("should not emit a value or complete", () => {
      const spyObserver = newSpyObserver();
      const subscription = observable.subscribe(spyObserver);

      nextTrigger(1);
      nextTrigger(2);
      nextTrigger(3);
      errorTrigger(new Error("observer error"));
      nextTrigger(4);
      completeTrigger();
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenNthCalledWith(1, 1);
      expect(spyObserver.next).toHaveBeenNthCalledWith(2, 2);
      expect(spyObserver.next).toHaveBeenNthCalledWith(3, 3);
      expect(spyObserver.next).toHaveBeenCalledTimes(3);
      expect(spyObserver.error).toHaveBeenCalledWith(expect.objectContaining({
        message: "observer error"
      }));
      expect(spyObserver.complete).not.toHaveBeenCalled();
      expect(tearDownSpy).toHaveBeenCalled();
    });
  });

  describe("upon call to observer.complete", () => {
    test("should complete when the complete method is called on the observer", () => {
      const spyObserver = newSpyObserver();
      const subscription = observable.subscribe(spyObserver);

      nextTrigger(1);
      nextTrigger(2);
      nextTrigger(3);
      completeTrigger();
      nextTrigger(4);
      errorTrigger(new Error("observer error"));
      subscription.unsubscribe();

      expect(spyObserver.next).toHaveBeenNthCalledWith(1, 1);
      expect(spyObserver.next).toHaveBeenNthCalledWith(2, 2);
      expect(spyObserver.next).toHaveBeenNthCalledWith(3, 3);
      expect(spyObserver.next).toHaveBeenCalledTimes(3);
      expect(spyObserver.error).not.toHaveBeenCalled();
      expect(spyObserver.complete).toHaveBeenCalled();
      expect(tearDownSpy).toHaveBeenCalled();
    });
  });

  describe("when having more than one subscription", () => {
    let spyObserverOne: ObserverSpy;
    let spyObserverTwo: ObserverSpy;
    let subscriptionOne: Subscription;
    let subscriptionTwo: Subscription;

    beforeEach(() => {
      spyObserverOne = newSpyObserver();
      spyObserverTwo = newSpyObserver();
      subscriptionOne = observable.subscribe(spyObserverOne as unknown as Observer<number>);
      subscriptionTwo = observable.subscribe(spyObserverTwo as unknown as Observer<number>);
    });

    test("calls to observer.next should spread to all subscriptions", () => {
      nextTrigger(1);
      nextTrigger(2);
      nextTrigger(3);

      expect(spyObserverOne.next).toHaveBeenNthCalledWith(1, 1);
      expect(spyObserverOne.next).toHaveBeenNthCalledWith(2, 2);
      expect(spyObserverOne.next).toHaveBeenNthCalledWith(3, 3);
      expect(spyObserverOne.error).not.toHaveBeenCalled();
      expect(spyObserverOne.complete).not.toHaveBeenCalled();
      expect(spyObserverTwo.next).toHaveBeenNthCalledWith(1, 1);
      expect(spyObserverTwo.next).toHaveBeenNthCalledWith(2, 2);
      expect(spyObserverTwo.next).toHaveBeenNthCalledWith(3, 3);
      expect(spyObserverTwo.error).not.toHaveBeenCalled();
      expect(spyObserverTwo.complete).not.toHaveBeenCalled();
      expect(tearDownSpy).not.toHaveBeenCalled();
    });

    test("calls to observer.error should spread to all subscriptions and stop emitting", () => {
      nextTrigger(1);
      nextTrigger(2);
      nextTrigger(3);
      errorTrigger(new Error("observer error"));
      nextTrigger(4);
      completeTrigger();

      expect(spyObserverOne.next).toHaveBeenNthCalledWith(1, 1);
      expect(spyObserverOne.next).toHaveBeenNthCalledWith(2, 2);
      expect(spyObserverOne.next).toHaveBeenNthCalledWith(3, 3);
      expect(spyObserverOne.next).toHaveBeenCalledTimes(3);
      expect(spyObserverOne.error).toHaveBeenCalledWith(expect.objectContaining({
        message: "observer error"
      }));
      expect(spyObserverTwo.complete).not.toHaveBeenCalled();
      expect(spyObserverTwo.next).toHaveBeenNthCalledWith(1, 1);
      expect(spyObserverTwo.next).toHaveBeenNthCalledWith(2, 2);
      expect(spyObserverTwo.next).toHaveBeenNthCalledWith(3, 3);
      expect(spyObserverTwo.next).toHaveBeenCalledTimes(3);
      expect(spyObserverTwo.error).toHaveBeenCalledWith(expect.objectContaining({
        message: "observer error"
      }));
      expect(spyObserverTwo.complete).not.toHaveBeenCalled();
      expect(tearDownSpy).not.toHaveBeenCalled();
    });

    test("calls to observer.complete should spread to all subscriptions and stop emitting", () => {
      nextTrigger(1);
      nextTrigger(2);
      nextTrigger(3);
      completeTrigger();
      nextTrigger(4);
      errorTrigger(new Error("observer error"));

      expect(spyObserverOne.next).toHaveBeenNthCalledWith(1, 1);
      expect(spyObserverOne.next).toHaveBeenNthCalledWith(2, 2);
      expect(spyObserverOne.next).toHaveBeenNthCalledWith(3, 3);
      expect(spyObserverOne.next).toHaveBeenCalledTimes(3);
      expect(spyObserverOne.error).not.toHaveBeenCalled();
      expect(spyObserverOne.complete).toHaveBeenCalled();
      expect(spyObserverTwo.next).toHaveBeenNthCalledWith(1, 1);
      expect(spyObserverTwo.next).toHaveBeenNthCalledWith(2, 2);
      expect(spyObserverTwo.next).toHaveBeenNthCalledWith(3, 3);
      expect(spyObserverTwo.next).toHaveBeenCalledTimes(3);
      expect(spyObserverTwo.error).not.toHaveBeenCalled();
      expect(spyObserverTwo.complete).toHaveBeenCalled();
      expect(tearDownSpy).not.toHaveBeenCalled();
    });

    test("upon unsubscribe it should stop receiving values/errors/complete for that subscription", () => {
      nextTrigger(1);
      nextTrigger(2);
      subscriptionOne.unsubscribe();
      nextTrigger(3);
      nextTrigger(4);
      completeTrigger();

      expect(spyObserverOne.next).toHaveBeenNthCalledWith(1, 1);
      expect(spyObserverOne.next).toHaveBeenNthCalledWith(2, 2);
      expect(spyObserverOne.next).toHaveBeenCalledTimes(2);
      expect(spyObserverOne.error).not.toHaveBeenCalled();
      expect(spyObserverOne.complete).not.toHaveBeenCalled();
      expect(spyObserverTwo.next).toHaveBeenNthCalledWith(1, 1);
      expect(spyObserverTwo.next).toHaveBeenNthCalledWith(2, 2);
      expect(spyObserverTwo.next).toHaveBeenNthCalledWith(3, 3);
      expect(spyObserverTwo.next).toHaveBeenNthCalledWith(4, 4);
      expect(spyObserverTwo.next).toHaveBeenCalledTimes(4);
      expect(spyObserverTwo.error).not.toHaveBeenCalled();
      expect(spyObserverTwo.complete).toHaveBeenCalled();
      expect(tearDownSpy).not.toHaveBeenCalled();
    });

    test("upon unsubscribe in all subscriptions it should tear down the observable", () => {
      nextTrigger(1);
      nextTrigger(2);
      subscriptionOne.unsubscribe();
      nextTrigger(3);
      subscriptionTwo.unsubscribe();
      nextTrigger(4);
      completeTrigger();

      expect(spyObserverOne.next).toHaveBeenNthCalledWith(1, 1);
      expect(spyObserverOne.next).toHaveBeenNthCalledWith(2, 2);
      expect(spyObserverOne.next).toHaveBeenCalledTimes(2);
      expect(spyObserverOne.error).not.toHaveBeenCalled();
      expect(spyObserverOne.complete).not.toHaveBeenCalled();
      expect(spyObserverTwo.next).toHaveBeenNthCalledWith(1, 1);
      expect(spyObserverTwo.next).toHaveBeenNthCalledWith(2, 2);
      expect(spyObserverTwo.next).toHaveBeenNthCalledWith(3, 3);
      expect(spyObserverTwo.next).toHaveBeenCalledTimes(3);
      expect(spyObserverTwo.error).not.toHaveBeenCalled();
      expect(spyObserverTwo.complete).not.toHaveBeenCalled();
      expect(tearDownSpy).toHaveBeenCalled();
    });
  });
});
