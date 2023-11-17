var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { Observable } from '../observable.js';
import { from } from '../factories/from.js';
export function switchMap(project) {
    return (source) => {
        return new Observable((observer) => {
            let count = 0;
            let innerSubscription;
            const sourceSubscription = source.subscribe({
                next: (value) => {
                    const { complete } = observer, partial = __rest(observer, ["complete"]);
                    if (innerSubscription) {
                        innerSubscription.unsubscribe();
                    }
                    innerSubscription = from(project(value, count++)).subscribe(partial);
                },
                error: (err) => {
                    observer.error(err);
                },
                complete: () => {
                    observer.complete();
                },
            });
            return () => {
                if (innerSubscription) {
                    innerSubscription.unsubscribe();
                }
                return sourceSubscription.unsubscribe();
            };
        });
    };
}
//# sourceMappingURL=switchMap.js.map