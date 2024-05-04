/**
 * @template T
 * @param {import('../observable').ObservableInput<T>} input
 * @returns {import('../observable').Observable<T>}
 */
export function from<T>(input: import("../observable.js").ObservableInput<T>): Observable<T>;
import { Observable } from '../observable.js';
