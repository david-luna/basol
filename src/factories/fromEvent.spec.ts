import { fromEvent } from "./fromEvent";

describe("fromEvent factory", () => {
  test("should create an observable which emits when an event occurs", () => {
    const divElement = document.createElement("div") as HTMLDivElement;
    const addListenerSpy = jest.spyOn(divElement, "addEventListener");
    const removeListenerSpy = jest.spyOn(divElement, "removeEventListener");
    const subscription = fromEvent<CustomEvent>(divElement, "custom-event").subscribe({
      next: (event) => {
        expect(event.detail).toEqual(expect.any(Number));
      }
    });

    divElement.dispatchEvent(new CustomEvent("custom-event", { detail: 1 }));
    divElement.dispatchEvent(new CustomEvent("custom-event", { detail: 2 }));
    divElement.dispatchEvent(new CustomEvent("custom-event", { detail: 3 }));
    subscription.unsubscribe();

    expect(addListenerSpy).toHaveBeenCalledWith("custom-event", expect.any(Function));
    expect(removeListenerSpy).toHaveBeenCalledWith("custom-event", expect.any(Function));
    expect.assertions(5);
  });
});
