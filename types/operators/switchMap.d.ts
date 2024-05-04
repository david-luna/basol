/**
 * @template T
 * @template {import('../observable').ObservableInput<any>} R
 * @param {(value: any, index: number) => R} project
 * @returns {import('../observable').OperatorFunction<T, import('../observable').ObservedValueOf<R>>}
 */
export function switchMap<T, R extends import("../observable.js").ObservableInput<any>>(project: (value: any, index: number) => R): import("../observable.js").OperatorFunction<T, import("../observable.js").ObservedValueOf<R>>;
