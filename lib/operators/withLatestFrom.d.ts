import { Observable } from '../observable.js';
import { OperatorFunction } from '../types';
export declare function withLatestFrom<T, A, B>(a: Observable<A>, b: Observable<B>): OperatorFunction<T, [T, A, B]>;
export declare function withLatestFrom<T, A, B, C>(a: Observable<A>, b: Observable<B>, c: Observable<C>): OperatorFunction<T, [T, A, B, C]>;
export declare function withLatestFrom<T, A, B, C, D>(a: Observable<A>, b: Observable<B>, c: Observable<C>, d: Observable<D>): OperatorFunction<T, [T, A, B, C, D]>;
export declare function withLatestFrom<T, A, B, C, D, E>(a: Observable<A>, b: Observable<B>, c: Observable<C>, d: Observable<D>, e: Observable<E>): OperatorFunction<T, [T, A, B, C, D, E]>;
//# sourceMappingURL=withLatestFrom.d.ts.map