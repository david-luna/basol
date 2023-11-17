import { Observable } from '../observable.js';
export function fromEvent(target, eventName) {
    return new Observable((observer) => {
        const handler = (event) => {
            observer.next(event);
        };
        target.addEventListener(eventName, handler);
        return () => {
            target.removeEventListener(eventName, handler);
        };
    });
}
//# sourceMappingURL=fromEvent.js.map