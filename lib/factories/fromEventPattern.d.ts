import { Observable } from '../observable.js';
export declare type EventHandlerLike = (...args: unknown[]) => void;
export declare function fromEventPattern<T>(addHandler: (handler: EventHandlerLike) => unknown, removeHandler: (handler: EventHandlerLike, signal: unknown) => unknown, project?: (...args: any[]) => T): Observable<T>;
//# sourceMappingURL=fromEventPattern.d.ts.map