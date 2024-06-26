import { mock } from 'node:test';
import { createObsevable } from '../../lib/observable.js';

/**
 * @callback AnyFunction
 * @param {...any} args
 * @returns {any}
 */

/**
 * @typedef {import('node:test').Mock<AnyFunction>['mock']} MockFunction
 */

/**
 * @template T
 * @typedef {Object} ObservableMock
 * @property {import('../../lib/observable').Observable<T>} observable
 * @property {Object} triggers
 * @property {(val: T) => void} triggers.next
 * @property {(err: any) => void} triggers.error
 * @property {() => void} triggers.complete
 * @property {Object} mocks
 * @property {import('node:test').Mock<AnyFunction>} mocks.next
 * @property {import('node:test').Mock<AnyFunction>} mocks.error
 * @property {import('node:test').Mock<AnyFunction>} mocks.complete
 * @property {import('node:test').Mock<AnyFunction>} mocks.tearDown
 */

/**
 * @template T
 * @returns {ObservableMock<T>}
 */
export function createMockObservable() {
  /** @type {any} */
  const wrapper = { triggers: {}, mocks: {} };

  wrapper.mocks.tearDown = mock.fn();
  wrapper.observable = createObsevable((observer) => {
    wrapper.triggers.next = (val) => observer.next(val);
    wrapper.triggers.error = (err) => observer.error(err);
    wrapper.triggers.complete = () => observer.complete();

    return wrapper.mocks.tearDown;
  });

  return wrapper;
}

/**
 * @template {unknown} T
 * @typedef {Object} ObserverMock
 * @property {import('node:test').Mock<AnyFunction>} next
 * @property {import('node:test').Mock<AnyFunction>} error
 * @property {import('node:test').Mock<AnyFunction>} complete
 */

/**
 * @template T
 * @returns {ObserverMock<T>}
 */
export function createMockObserver() {
  return {
    next: mock.fn(),
    error: mock.fn(),
    complete: mock.fn(),
  };
}
