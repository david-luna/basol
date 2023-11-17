import { Observable } from '../observable.js';
export interface EventListenerObject<E> {
    handleEvent(evt: E): void;
}
export interface HasEventTargetAddRemove<E> {
    addEventListener(type: string, listener: ((evt: E) => void) | EventListenerObject<E> | null, options?: boolean | AddEventListenerOptions): void;
    removeEventListener(type: string, listener: ((evt: E) => void) | EventListenerObject<E> | null, options?: EventListenerOptions | boolean): void;
}
export declare type FromEventTarget<T> = HasEventTargetAddRemove<T>;
export declare function fromEvent<T>(target: FromEventTarget<T>, eventName: string): Observable<T>;
//# sourceMappingURL=fromEvent.d.ts.map