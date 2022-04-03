/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { EventHandlerLike, fromEventPattern } from './fromEventPattern';
import { newSpyObserver } from '../__test__';

describe('fromEventPattern factory', () => {
  test('should create an observable which emits when an event occurs', () => {
    const divElement = document.createElement('div') as HTMLDivElement;
    const addListenerSpy = jest.spyOn(divElement, 'addEventListener');
    const removeListenerSpy = jest.spyOn(divElement, 'removeEventListener');
    const spyObserver = newSpyObserver();

    function addClickHandler(handler: EventHandlerLike) {
      divElement.addEventListener('custom-event', handler);
    }
    function removeClickHandler(handler: EventHandlerLike) {
      divElement.removeEventListener('custom-event', handler);
    }

    const subscription = fromEventPattern(addClickHandler, removeClickHandler).subscribe(spyObserver);

    divElement.dispatchEvent(new CustomEvent('custom-event', { detail: 1 }));
    divElement.dispatchEvent(new CustomEvent('custom-event', { detail: 2 }));
    divElement.dispatchEvent(new CustomEvent('custom-event', { detail: 3 }));
    subscription.unsubscribe();

    expect(addListenerSpy).toHaveBeenCalledWith('custom-event', expect.any(Function));
    expect(spyObserver.next).toHaveBeenCalledWith(expect.objectContaining({ detail: 1 }));
    expect(spyObserver.next).toHaveBeenCalledWith(expect.objectContaining({ detail: 2 }));
    expect(spyObserver.next).toHaveBeenCalledWith(expect.objectContaining({ detail: 3 }));
    expect(removeListenerSpy).toHaveBeenCalledWith('custom-event', expect.any(Function));
  });

  test('should create an observable with a projection', () => {
    const divElement = document.createElement('div') as HTMLDivElement;
    const addListenerSpy = jest.spyOn(divElement, 'addEventListener');
    const removeListenerSpy = jest.spyOn(divElement, 'removeEventListener');
    const spyObserver = newSpyObserver();

    function addClickHandler(handler: EventHandlerLike) {
      divElement.addEventListener('custom-event', handler);
    }
    function removeClickHandler(handler: EventHandlerLike) {
      divElement.removeEventListener('custom-event', handler);
    }
    function project(event: { detail: number }): number {
      return event.detail * 1000;
    }

    const subscription = fromEventPattern(addClickHandler, removeClickHandler, project).subscribe(spyObserver);

    divElement.dispatchEvent(new CustomEvent('custom-event', { detail: 1 }));
    divElement.dispatchEvent(new CustomEvent('custom-event', { detail: 2 }));
    divElement.dispatchEvent(new CustomEvent('custom-event', { detail: 3 }));
    subscription.unsubscribe();

    expect(addListenerSpy).toHaveBeenCalledWith('custom-event', expect.any(Function));
    expect(spyObserver.next).toHaveBeenCalledWith(1000);
    expect(spyObserver.next).toHaveBeenCalledWith(2000);
    expect(spyObserver.next).toHaveBeenCalledWith(3000);
    expect(removeListenerSpy).toHaveBeenCalledWith('custom-event', expect.any(Function));
  });

  test('should pass the signal for removing event listener', () => {
    jest.useFakeTimers();
    const setIntervalSpy = jest.spyOn(global, 'setInterval');
    const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
    const spyObserver = newSpyObserver();
    let count = 0;

    function addHandler(handler: EventHandlerLike) {
      return setInterval(() => handler(++count), 10);
    }
    function removeHandler(handler: EventHandlerLike, signal: unknown) {
      return clearInterval(signal as number);
    }

    const subscription = fromEventPattern(addHandler, removeHandler).subscribe(spyObserver);

    jest.advanceTimersByTime(30);
    subscription.unsubscribe();

    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 10);
    expect(spyObserver.next).toHaveBeenCalledWith(1);
    expect(spyObserver.next).toHaveBeenCalledWith(2);
    expect(spyObserver.next).toHaveBeenCalledWith(3);
    expect(clearIntervalSpy).toHaveBeenCalledWith(expect.any(Number));
  });
});
