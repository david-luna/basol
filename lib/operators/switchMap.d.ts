import { ObservableInput, OperatorFunction, ObservedValueOf } from '../types';
export declare function switchMap<T, R extends ObservableInput<any>>(project: (value: T, index: number) => R): OperatorFunction<T, ObservedValueOf<R>>;
//# sourceMappingURL=switchMap.d.ts.map