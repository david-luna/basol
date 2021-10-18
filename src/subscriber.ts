import { Observer } from "./types";

const noop = (): void => {
    return void 0;
};

export class Subscriber<T> {
    private readonly teardown: Function;
    private readonly observer: Observer<T>;
    private stopped: boolean;

    constructor(observer: Partial<Observer<T>>, teardown: (s: Subscriber<T>) => void) {
        this.stopped = false;
        this.teardown = teardown;
        this.observer = {
            next: (observer.next || noop).bind(observer),
            error: (observer.error || noop).bind(observer),
            complete: (observer.complete || noop).bind(observer)
        };
    }

    next(value: T): void {
        if (this.stopped) {
            return;
        }
        this.observer.next(value);
    }

    error(error: any): void {
        if (this.stopped) {
            return;
        }
        this.observer.error(error);
        this.stopped = true;
    }

    complete(): void {
        if (this.stopped) {
            return;
        }
        this.observer.complete();
        this.stopped = true;
    }

    unsubscribe(): void {
        this.stopped = true;
        this.teardown(this);
    }
}
