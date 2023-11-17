import { Observable } from '../observable.js';
export function sequence(period = 0, factory = (x) => x) {
  return new Observable((observer) => {
    let index = 0;
    const id = setInterval(() => observer.next(factory(index++)), period);
    return () => {
      clearInterval(id);
    };
  });
}
//# sourceMappingURL=sequence.js.map
