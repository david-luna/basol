import { Observable } from '../observable.js';
export function interval(period) {
  return new Observable((observer) => {
    let index = 0;
    const id = setInterval(() => observer.next(index++), period);
    return () => {
      clearInterval(id);
    };
  });
}
//# sourceMappingURL=interval.js.map
