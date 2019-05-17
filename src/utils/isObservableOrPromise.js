import isObservable from './isObservable';
import isPromise from './isPromise';

/**
 * Determines if the provided source is an
 * observable or promise.
 * @param {any} src - The source to check
 * @returns {string|boolean} - "observable" if
 * the source is an observable, "promise" if
 * it is a promise, or false if it is neither.
 */
function isObservableOrPromise(src) {
  if (isObservable(src)) return 'observable';
  if (isPromise(src)) return 'promise';
  return false;
}

export default isObservableOrPromise;