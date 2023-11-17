import { Observable } from '../observable.js';
declare type SequenceFactory<T> = (index: number) => T;
export declare function sequence(period: number): Observable<number>;
export declare function sequence<T>(period: number, factory: SequenceFactory<T>): Observable<T>;
export {};
//# sourceMappingURL=sequence.d.ts.map