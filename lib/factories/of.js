import { createObsevable } from '../observable.js';

// TODO: figure out how to type this function accepting a variable
// num of type parameters
export function of(...inputs) {
  return createObsevable((observer) => {
    inputs.forEach((input) => observer.next(input));
    observer.complete();
  });
}
