/**
 * @template {EventTargetLike<any> | EventEmitterLike<any>} T
 * @param {T} target
 * @param {string} eventName
 * @returns {import('../observable').Observable<EventOrParams<T>>}
 */
export function fromEvent<T extends EventTargetLike<any> | EventEmitterLike<any>>(target: T, eventName: string): import("../observable.js").Observable<EventOrParams<T>>;
/**
 * NOTE: to mimic browser's CustomEvent
 */
export type NodeOrBrowserEvent = Event | (Event & {
    detail: any;
});
export type EventListenerFn<T extends NodeOrBrowserEvent> = (type: string, listener: ((e: T) => void) | {
    handleEvent: (e: T) => void;
} | null, options?: any) => any;
/**
 * <T>
 */
export type EventTargetLike<T extends NodeOrBrowserEvent> = {
    addEventListener: EventListenerFn<T>;
    removeEventListener: EventListenerFn<T>;
};
export type ListenerFn<T extends (...args: any[]) => void> = (type: string, listener: T, options?: any) => any;
/**
 * <T>
 */
export type EventEmitterLike<T extends (...args: any[]) => void> = {
    addListener: ListenerFn<T>;
    removeListener: ListenerFn<T>;
};
/**
 * <T>
 */
export type EventParam<T> = T extends EventTargetLike<infer E extends NodeOrBrowserEvent> ? E : never;
/**
 * <T>
 */
export type EventOrParams<T> = T extends EventEmitterLike<infer F extends (...args: any[]) => void> ? Parameters<F> : EventParam<T>;
