import { Observable } from '../observable.js';
export function of(...inputs) {
  return new Observable((observer) => {
    inputs.forEach((input) => observer.next(input));
    observer.complete();
  });
}
//# sourceMappingURL=of.js.map
