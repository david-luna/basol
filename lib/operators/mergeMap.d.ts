import { Observable } from '../observable.js';
import { OperatorFunction } from '../types';
export declare function mergeMap<T, P>(project: (value: T, index: number) => Observable<P>): OperatorFunction<T, P>;
//# sourceMappingURL=mergeMap.d.ts.map