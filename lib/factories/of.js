import { Observable } from '../observable.js';

// TODO: figure out how to type this funciton accepting a variable
// num of type parameters
export function of(...inputs) {
  return new Observable((observer) => {
    inputs.forEach((input) => observer.next(input));
    observer.complete();
  });
}
