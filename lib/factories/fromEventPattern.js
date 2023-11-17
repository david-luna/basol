import { Observable } from '../observable.js';
export function fromEventPattern(addHandler, removeHandler, project) {
  return new Observable((observer) => {
    const handler = (...args) => observer.next(project ? project(...args) : args[0]);
    const signal = addHandler(handler);
    return () => {
      removeHandler(handler, signal);
    };
  });
}
//# sourceMappingURL=fromEventPattern.js.map
