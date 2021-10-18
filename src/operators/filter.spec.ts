import { filter } from "./filter";
import { Observable } from "../observable";
import { Observer } from "../types";


describe("filter operator", () => {
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
            complete: jest.fn()
        };
    };
    // eslint-disable-next-line arrow-body-style
    const toEven = filter((x: number) => x % 2 === 0);
    const evenNumbers = toEven(sourceNumbers);

    describe("upon emitted value in the source observable", () => {
        test("should emit the filtered values", () => {
            const spyObserver = newSpyObserver();
            const subscription = evenNumbers.subscribe(spyObserver);

            nextTrigger(2);
            nextTrigger(3);
            nextTrigger(4);
            subscription.unsubscribe();

            expect(spyObserver.next).toHaveBeenCalledWith(2);
            expect(spyObserver.next).toHaveBeenCalledWith(4);
            expect(spyObserver.next).toHaveBeenCalledTimes(2);
            expect(spyObserver.error).not.toHaveBeenCalled();
            expect(spyObserver.complete).not.toHaveBeenCalled();
            expect(tearDownSpy).toHaveBeenCalled();
        });
    });

    describe("upon error in the source observable", () => {
        test("should error in the filtered observables", () => {
            const spyObserver = newSpyObserver();
            const subscription = evenNumbers.subscribe(spyObserver);

            nextTrigger(2);
            errorTrigger(new Error("observer error"));
            subscription.unsubscribe();

            expect(spyObserver.next).toHaveBeenCalledWith(2);
            expect(spyObserver.error).toHaveBeenCalledWith(expect.objectContaining({
                message: "observer error"
            }));
            expect(spyObserver.complete).not.toHaveBeenCalled();
            expect(tearDownSpy).toHaveBeenCalled();
        });
    });

    describe("upon complete in the source observable", () => {
        test("should complete in the filtered observables", () => {
            const spyObserver = newSpyObserver();
            const subscription = evenNumbers.subscribe(spyObserver);

            nextTrigger(2);
            completeTrigger();
            subscription.unsubscribe();

            expect(spyObserver.next).toHaveBeenCalledWith(2);
            expect(spyObserver.error).not.toHaveBeenCalled();
            expect(spyObserver.complete).toHaveBeenCalled();
            expect(tearDownSpy).toHaveBeenCalled();
        });
    });

});
