const noop = () => {
  return void 0;
};

export class Subscriber {
  constructor(observer, teardown) {
    this.stopped = false;
    this.teardown = teardown;
    this.observer = {
      next: (observer.next || noop).bind(observer),
      error: (observer.error || noop).bind(observer),
      complete: (observer.complete || noop).bind(observer),
    };
  }
  next(value) {
    if (this.stopped) {
      return;
    }
    this.observer.next(value);
  }
  error(error) {
    if (this.stopped) {
      return;
    }
    this.observer.error(error);
    this.stopped = true;
  }
  complete() {
    if (this.stopped) {
      return;
    }
    this.observer.complete();
    this.stopped = true;
  }
  unsubscribe() {
    this.stopped = true;
    this.teardown(this);
  }
}
