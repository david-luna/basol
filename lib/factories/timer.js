import { Observable } from '../observable.js';
export function timer(due) {
  return new Observable((observer) => {
    const time = typeof due === 'number' ? due : due.getTime() - Date.now();
    const id = setTimeout(() => {
      observer.next();
      observer.complete();
    }, time);
    return () => {
      clearTimeout(id);
    };
  });
}
//# sourceMappingURL=timer.js.map
