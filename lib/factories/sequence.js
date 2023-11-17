import { Observable } from '../observable.js';

// TODO: figure out how to type this funciton accepting a variable
// num of type parameters
export function sequence(period = 0, factory = (x) => x) {
  return new Observable((observer) => {
    let index = 0;
    const id = setInterval(() => observer.next(factory(index++)), period);
    return () => {
      clearInterval(id);
    };
  });
}
